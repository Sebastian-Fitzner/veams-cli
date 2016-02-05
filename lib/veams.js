/* ==============================================
 * Requirements
 * ============================================== */
var Helpers = require('./utils/helpers');
var exec = require('child_process').exec;
var Yeoman = require('yeoman-environment');
var Env = Yeoman.createEnv();
var fsx = require('fs-extra');
var path = require('path');
var Insert = require('inserter');
var chalk = require('chalk');
var genPkg = require('../node_modules/generator-veams/package.json');
var inserterPkg = require('../node_modules/inserter/package.json');
var pkg = require('../package.json');
var updateNotifier = require('update-notifier');

/* ==============================================
 * Vars/ Configs
 * ============================================== */
var veams = {
	DATA: {
		bowerDir: getBowerDir,
		projectConfig: getProjectConfig
	}
};

/* ==============================================
 * Functions
 * ============================================== */

/**
 * Register all generators
 */
Helpers.generatorPath.forEach(function (gen) {
	Env.register(require.resolve(gen.path), gen.cmd);
});

function listDependencies(deps) {
	Object.keys(deps).forEach(function (depName) {
		var required = deps[depName].required || '*';
		var stable = deps[depName].stable || 'None';
		var latest = deps[depName].latest;
		console.log('%s Required: %s Stable: %s Latest: %s', depName, required, stable, latest);
	});
}

/**
 * NPM Install function.
 *
 * @param {String} module - A module name
 * @param {Function} cb - callback function
 */
function npmInstall(module, opts, cb) {
	var callback = cb || function (err, stdout, stderr) {
				if (err) {
					Helpers.message('red', Helpers.msg.error(error, stderr));
				} else {
					Helpers.message('gray', stdout);
					Helpers.message('green', Helpers.msg.success(module));
				}
			};

	exec('npm install ' + module + ' ' + opts, callback);
}

/**
 * Bower Install function.
 *
 * @param {String} component - A component name
 * @param {String} opts - Further options
 * @param {Function} cb - callback function
 */
function bowerInstall(component, opts, cb) {
	var callback = cb || function (error, stdout, stderr) {
				if (error) {
					Helpers.message('red', Helpers.msg.error(error, stderr));
				} else {
					Helpers.message('gray', stdout);
					Helpers.message('green', Helpers.msg.success(component));
				}
			};

	exec('bower install ' + component + ' ' + opts, callback);
}

/**
 * Environment check and generator start.
 *
 * @param {String} generatorName - Name of the generator
 * @param {String} opts - Further options you can pass
 * @param {String} item - Item which is scaffolded
 * @param {Function} cb - Callback function
 */
function runGenerator(generatorName, opts, item, cb) {
	Env.run(generatorName + ' ' + opts, function (err) {
		if (err) {
			Helpers.message('red', Helpers.msg.error(err));
		} else {
			Helpers.message('green', Helpers.msg.success(item));
		}

		if (cb) cb();
	});
}

/**
 * Add component files to project.
 *
 * @param {String} path - path to blueprint
 * @param {String} name - name of blueprint
 * @param {String} type - type of blueprint (component, block)
 */
function addBlueprintFiles(path, name, type) {
	var bpType = type || 'component';

	try {
		fsx.copySync(path + '/partials', veams.DATA.projectConfig().paths[bpType] + '/' + name);
		fsx.copySync(path + '/data', veams.DATA.projectConfig().paths[bpType] + '/' + name);
		fsx.copySync(path + '/scss', veams.DATA.projectConfig().paths.scss + '/' + bpType + 's/');

		if (fsx.existsSync(path + '/js')) {
			fsx.copySync(path + '/js', veams.DATA.projectConfig().paths.js + '/' + '/modules/' + name);
		}

		Helpers.message('green', Helpers.msg.success(name + ' files'));

	} catch (err) {
		Helpers.message('red', Helpers.msg.error(err.message));
	}
}

/**
 * Use inserter to integrate snippets into project.
 *
 * @param {String} path - path to component
 */
function insertBlueprint(path) {
	var insert = new Insert({
		tplFolder: [path],
		endpointFolders: [
			veams.DATA.projectConfig().paths.page,
			veams.DATA.projectConfig().paths.scss,
			veams.DATA.projectConfig().paths.js
		]
	});

	insert.render();
}

function getBowerDir() {
	var bowerDir = 'bower-components';

	try {
		bowerDir = JSON.parse(fsx.readFileSync(process.cwd() + '/.bowerrc', 'utf-8')).directory;
	} catch (error) {
		Helpers.message('yellow', Helpers.msg.info('.bowerrc not found in this directory!'));
	}
	return bowerDir;
}

function getProjectConfig() {
	var config = {
		paths: {
			page: 'resources/templating/pages',
			global: 'resources/templating/partials/globals',
			block: 'resources/templating/partials/blocks',
			component: 'resources/templating/partials/components',
			scss: 'resources/scss',
			js: 'resources/js'
		}
	};

	try {
		var pkgFile = JSON.parse(fsx.readFileSync(process.cwd() + '/package.json', 'utf-8')).directory;
		config = pkgFile && pkgFile.veams ? JSON.parse(fsx.readFileSync(process.cwd() + pkgFile.veams.configFile, 'utf-8')).options : config;
	} catch (error) {
		Helpers.message('yellow', Helpers.msg.info('No package.json found!'));
	}

	return config;
}

function checkUpdateAvailability() {
	var message = [];
	var genNotifier = updateNotifier({pkg: genPkg, updateCheckInterval: 1000 * 60 * 60 * 24});
	var veamsNotifier = updateNotifier({pkg: pkg, updateCheckInterval: 1000 * 60 * 60 * 24});
	var inserterNotifier = updateNotifier({pkg: inserterPkg, updateCheckInterval: 1000 * 60 * 60 * 24});

	if (genNotifier.update || veamsNotifier.update || inserterNotifier.update) {
		message.push(chalk.gray('Update available for: \n\n'));

		if (genNotifier && genNotifier.update) {
			message.push(Helpers.extensions.generatorId + chalk.gray(' (') + chalk.green.bold(genNotifier.update.latest) + chalk.gray(') - current: ' + genNotifier.update.current + '\n')
			);
		}

		if (veamsNotifier && veamsNotifier.update) {
			message.push(pkg.name + chalk.gray(' (') + chalk.green.bold(veamsNotifier.update.latest) + chalk.gray(') - current: ' + veamsNotifier.update.current + '\n')
			);
		}

		if (inserterNotifier && inserterNotifier.update) {
			message.push(inserterPkg.name + chalk.gray(' (') + chalk.green.bold(inserterNotifier.update.latest) + chalk.gray(') - current: ' + inserterNotifier.update.current + '\n')
			);
		}

		message.push(chalk.gray('   - Run ' + chalk.magenta('veams update') + ' to update.\n'));

		Helpers.message('magenta', Helpers.msg.info(message.join(' ')));
	}
}

function getVersions() {
	var message = [];

	message.push(genPkg.name + ': ' + genPkg.version);
	message.push(pkg.name + ': ' + pkg.version);
	message.push(inserterPkg.name + ': ' + inserterPkg.version);

	Helpers.message('cyan', message.join('\n'));
}

/* ==============================================
 * Data
 * ============================================== */


/* ==============================================
 * Export
 * ============================================== */
module.exports = {
	DATA: veams.DATA,
	npmInstall: npmInstall,
	bowerInstall: bowerInstall,
	addBlueprintFiles: addBlueprintFiles,
	insertBlueprint: insertBlueprint,
	runGenerator: runGenerator,
	getBowerDir: getBowerDir,
	checkUpdateAvailability: checkUpdateAvailability,
	getVersions: getVersions
};