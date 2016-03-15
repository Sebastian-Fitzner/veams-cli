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
		projectConfig: getProjectConfig,
		configFile: getConfigFile,
		aliases: {
			cmds: {
				a: 'add',
				h: 'help',
				i: 'install',
				n: 'news',
				u: 'update',
				v: 'version'
			},
			exts: {
				vc: Helpers.extensions.componentId,
				vjs: Helpers.extensions.jsId,
				gm: Helpers.generatorId.gruntId,
				th: Helpers.generatorId.templatingId,
				bc: 'bower-component'
			},
			types: {
				bp: 'blueprint',
				c: 'component',
				b: 'block',
				p: 'project',
				u: 'utility'
			}
		}
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
 * @param {Object} obj - contains all elements
 * @param {String} obj.path - path to blueprint
 * @param {String} obj.name - name of blueprint
 * @param {String} obj.type - type of blueprint (component, block)
 * @param {Function} obj.cb - callback function
 */
function addBlueprintFiles(obj) {
	var bpType = obj.type || 'component';

	try {
		copyFile({
			src: obj.path + '/partials',
			dest: veams.DATA.projectConfig().paths[bpType] + '/' + obj.name,
			msg: false
		});
		copyFile({
			src: obj.path + '/data',
			dest: veams.DATA.projectConfig().paths[bpType] + '/' + obj.name,
			msg: false
		});
		copyFile({
			src: obj.path + '/scss',
			dest: veams.DATA.projectConfig().paths.scss + '/' + bpType + 's/',
			msg: false
		});
		copyFile({
			src: obj.path + '/js',
			dest: veams.DATA.projectConfig().paths.js + '/' + 'modules/' + obj.name,
			msg: false
		});
		copyFile({
			src: obj.path + '/usage',
			dest: veams.DATA.projectConfig().paths[bpType] + '/' + obj.name,
			msg: false
		});

		Helpers.message('green', Helpers.msg.success(obj.name + ' files'));

		if (obj.cb) obj.cb();

	} catch (err) {
		Helpers.message('red', Helpers.msg.error(err.message));
	}
}

/**
 * Copy file to specific destination.
 *
 * @param {Object} obj - object contains all paths
 * @param {Object} obj.src - root path of files
 * @param {String} obj.dest - destination path of files
 * @param {Boolean}obj.msg - control display of message
 */
function copyFile(obj) {
	var src = obj.src;
	var dest = obj.dest;
	var msg = obj.msg;

	try {
		fsx.copySync(src, dest);

		if (msg) {
			Helpers.message('green', Helpers.msg.success('Files in ' + src + ' '));
		}

	} catch (err) {
		if (msg) {
			Helpers.message('red', Helpers.msg.error(err.message));
		}
	}
}

/**
 * Use inserter to integrate snippets into project.
 *
 * @param {String} path - path to component
 */
function insertBlueprint(path) {
	var insert = new Insert({
		templates: [path],
		endpoints: veams.DATA.projectConfig().paths.endpoints
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
			js: 'resources/js',
			endpoints: [
				'resources/templating/pages',
				'resources/js/main.js',
				'resources/scss/styles.scss'
			]
		}
	};

	try {
		var configFile = getConfigFile();

		if (configFile) {
			config = require(process.cwd() + '/' + configFile).options;
		}
	} catch (error) {
		Helpers.message('yellow', Helpers.msg.info('No package.json or no configFile found: ' + error));
	}

	return config;
}

function getConfigFile() {
	return JSON.parse(fsx.readFileSync(process.cwd() + '/package.json', 'utf-8')).veams.configFile;
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
	copyFile: copyFile,
	addBlueprintFiles: addBlueprintFiles,
	insertBlueprint: insertBlueprint,
	runGenerator: runGenerator,
	getBowerDir: getBowerDir,
	checkUpdateAvailability: checkUpdateAvailability,
	getVersions: getVersions
};