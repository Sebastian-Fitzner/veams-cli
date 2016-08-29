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
var generatorPath = 'generator-veams/generators/';
var Veams = {};

/**
 * Extension ID's
 */
Veams.extensions = {
	generatorId: 'veams-generator',
	blockId: 'veams-block',
	componentId: 'veams-component',
	utilityId: 'veams-utility',
	componentsId: 'veams-components',
	jsId: 'veams-js',
	methdologyId: 'veams-methodology'
};


/**
 * Generators
 */
Veams.generators = {
	standard: 'veams:app',
	blueprint: 'veams:blueprint',
	grunt: 'veams:grunt',
	templating: 'veams:templating',
	js: 'veams:js'
};

/**
 * Generator paths
 */
Veams.generatorPath = [
	{
		path: generatorPath + 'app',
		cmd: Veams.generators.standard
	},
	{
		path: generatorPath + 'blueprint',
		cmd: Veams.generators.blueprint
	},
	{
		path: generatorPath + 'grunt',
		cmd: Veams.generators.grunt
	},
	{
		path: generatorPath + 'templating',
		cmd: Veams.generators.templating
	},
	{
		path: generatorPath + 'js',
		cmd: Veams.generators.js
	}
];

/**
 * Generator ids
 */
Veams.generatorId = {
	gruntId: 'grunt-module',
	templatingId: 'template-helper',
	jsId: 'js-module'
};

/**
 * Veams data
 */
Veams.DATA = {
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
			bc: 'bower-component',
			gm: Veams.generatorId.gruntId,
			th: Veams.generatorId.templatingId,
			vb: Veams.extensions.blockId,
			vc: Veams.extensions.componentId,
			vjs: Veams.extensions.jsId,
			vu: Veams.extensions.utilityId
		},
		types: {
			bp: 'blueprint',
			b: 'block',
			c: 'component',
			cu: 'custom',
			p: 'project',
			u: 'utility'
		}
	}
};

/* ==============================================
 * Functions
 * ============================================== */

function getProjectConfig() {
	var config = {
		paths: {
			page: 'resources/templating/pages',
			partial: 'resources/templating/partials',
			global: 'resources/templating/partials/globals',
			block: 'resources/templating/partials/blocks',
			component: 'resources/templating/partials/components',
			utility: 'resources/templating/partials/utilities',
			scss: 'resources/scss',
			js: 'resources/js',
			endpoints: [
				'resources/templating/pages',
				'resources/js/main.js',
				'resources/js/utils/events.js',
				'resources/scss/styles.scss'
			]
		}
	};

	try {
		var configFile = getConfigFile();

		if (configFile) {
			var tmpConfig = require(process.cwd() + '/' + configFile).options;
			config = Helpers.deepExtend(config, tmpConfig);
		}
	} catch (error) {
		Helpers.message('yellow', Helpers.msg.info('No package.json or no configFile found: ' + error));
	}

	return config;
}

function getConfigFile() {
	return JSON.parse(fsx.readFileSync(process.cwd() + '/package.json', 'utf-8')).veams.configFile;
}

/**
 * Register all generators
 */
Veams.generatorPath.forEach(function (gen) {
	Env.register(require.resolve(gen.path), gen.cmd);
});


/**
 * NPM Install function.
 *
 * @param {String} module - A module name
 * @param {String} opts - Options
 * @param {Function} cb - callback function
 */
function npmInstall(module, opts, cb) {
	var callback = cb || function (err, stdout, stderr) {
			if (err) {
				Helpers.message('red', Helpers.msg.error(err, stderr));
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
 * @param {String} obj.destFolder - custom folder in destination
 * @param {String} obj.name - name of blueprint
 * @param {String} obj.type - type of blueprint (component, block)
 * @param {Function} obj.cb - callback function
 */
function addBlueprintFiles(obj) {
	var projectType = Veams.DATA.projectConfig().config.projectType || 'standard';
	var bpType = obj.type || 'component';
	var scssFolder = bpType;
	var path = obj.type !== 'custom' ? Veams.DATA.projectConfig().paths[bpType] : Veams.DATA.projectConfig().paths['partial'];
	var folder = '';
	var jsPath;
	var scssPath;

	if (bpType === Veams.DATA.aliases.types.u) {
		scssFolder = 'utilitie'
	}

	if (bpType === Veams.DATA.aliases.types.cu) {
		folder = obj.destFolder + '/';
		scssFolder = obj.destFolder;
	}

	if (projectType === 'component') {
		jsPath = path + '/' + obj.name +'/js/';
		scssPath = path + '/' + obj.name + '/scss/';
	} else {
		jsPath = Veams.DATA.projectConfig().paths.js + '/' + 'modules/' + obj.name;
		scssPath = Veams.DATA.projectConfig().paths.scss + '/' + scssFolder + 's/';
	}

	try {
		Helpers.copyFile({
			src: obj.path + '/partials',
			dest: path + '/' + folder + obj.name,
			msg: false
		});
		Helpers.copyFile({
			src: obj.path + '/data',
			dest: path + '/' + folder + obj.name,
			msg: false
		});
		Helpers.copyFile({
			src: obj.path + '/scss',
			dest: scssPath,
			msg: false
		});
		Helpers.copyFile({
			src: obj.path + '/js',
			dest: jsPath,
			msg: false
		});
		Helpers.copyFile({
			src: obj.path + '/usage',
			dest: path + '/' + folder + obj.name,
			msg: false
		});
		Helpers.copyFile({
			src: obj.path + '/README.md',
			dest: path + '/' + folder + obj.name + '/README.md',
			msg: false
		});

		Helpers.message('green', Helpers.msg.success(obj.name + ' files'));

		if (obj.cb) obj.cb();

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
		templates: [path],
		endpoints: Veams.DATA.projectConfig().paths.endpoints
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

function checkUpdateAvailability() {
	var message = [];
	var genNotifier = updateNotifier({pkg: genPkg, updateCheckInterval: 1000 * 60 * 60 * 24});
	var veamsNotifier = updateNotifier({pkg: pkg, updateCheckInterval: 1000 * 60 * 60 * 24});
	var inserterNotifier = updateNotifier({pkg: inserterPkg, updateCheckInterval: 1000 * 60 * 60 * 24});

	if (genNotifier.update || veamsNotifier.update || inserterNotifier.update) {
		message.push(chalk.gray('Update available for: \n\n'));

		if (genNotifier && genNotifier.update) {
			message.push(Veams.extensions.generatorId + chalk.gray(' (') + chalk.green.bold(genNotifier.update.latest) + chalk.gray(') - current: ' + genNotifier.update.current + '\n')
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
	DATA: Veams.DATA,
	generators: Veams.generators,
	generatorId: Veams.generatorId,
	extensions: Veams.extensions,
	npmInstall: npmInstall,
	bowerInstall: bowerInstall,
	addBlueprintFiles: addBlueprintFiles,
	insertBlueprint: insertBlueprint,
	runGenerator: runGenerator,
	getBowerDir: getBowerDir,
	checkUpdateAvailability: checkUpdateAvailability,
	getVersions: getVersions
};