/* ==============================================
 * Requirements
 * ============================================== */
const exec = require('child-process-promise').exec;
const Yeoman = require('yeoman-environment');
const Env = Yeoman.createEnv();
const fsx = require('fs-extra');
const path = require('path');
const Insert = require('inserter');
const chalk = require('chalk');
const genPkg = require('../node_modules/generator-veams/package.json');
const inserterPkg = require('../node_modules/inserter/package.json');
const pkg = require('../package.json');
const updateNotifier = require('update-notifier');
const helpers = require('./utils/helpers');


/* ==============================================
 * Vars/ Configs
 * ============================================== */
const generatorPath = 'generator-veams/generators/';
const Veams = {};

/**
 * Extension ID's
 */
Veams.extensions = {
	generatorId: 'veams-generator',
	componentId: 'veams-component',
	utilityId: 'veams-utility',
	componentsId: 'veams-components',
	methdologyId: 'veams-methodology'
};


/**
 * Generators
 */
Veams.generators = {
	standard: 'veams:app',
	blueprint: 'veams:blueprint'
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
	}
];

/**
 * Veams data
 */
Veams.DATA = {
	projectConfig: getProjectConfig,
	configFile: getConfigFile,
	aliases: {
		cmds: {
			a: 'add',
			h: 'help',
			i: 'install',
			n: 'new',
			u: 'update',
			v: 'version'
		},
		exts: {
			bc: 'bower-component',
			vc: Veams.extensions.componentId,
			vu: Veams.extensions.utilityId
		},
		types: {
			bp: 'blueprint',
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

function getConfigFile() {
	return JSON.parse(fsx.readFileSync(process.cwd() + '/veams-cli.json', 'utf-8'));
}

function getProjectConfig() {
	try {
		return getConfigFile();
	} catch (error) {
		helpers.message('red', `No config file found: ${error}`);
	}
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
 */
function npmInstall(module, opts) {
	return exec(`npm install ${module} ${opts}`);
}

/**
 * Environment check and generator start.
 *
 * @param {String} generatorName - Name of the generator
 * @param {String} opts - Further options you can pass
 * @param {String} item - Item which is scaffolded
 */
function runGenerator(generatorName, opts, item) {
	return new Promise((resolve, reject) => {
		Env.run(`${generatorName} ${opts}`, function (err) {
			if (err) {
				reject(err);

			} else {
				resolve(item);
			}
		});
	});
}

/**
 * Get meta data for blueprint files which are generated to project.
 *
 * @param {String} name - name of blueprint
 * @param {String} type - type of blueprint (component, utility)
 */
function getBlueprintConfig({name, type = 'component'}) {
	let scaffoldPath = helpers.getPath(name);
	const scaffoldSrcPath = Veams.DATA.projectConfig().paths.src || 'src';

	if (scaffoldPath.length > 1) {
		name = path.basename(name);
		scaffoldPath = path.join(scaffoldSrcPath, scaffoldPath);
	} else {
		scaffoldPath = Veams.DATA.projectConfig().paths[type] || scaffoldSrcPath;
	}

	return {
		name: name,
		path: `${scaffoldPath}`,
		type: type
	};
}

/**
 * Use inserter to integrate snippets into project.
 *
 * @param {String} path - path to component
 */
function insertBlueprint(path) {
	const insert = new Insert({
		templates: [path],
		endpoints: Veams.DATA.projectConfig().insertpoints
	});

	insert.render();
}

function checkUpdateAvailability() {
	const message = [];
	const genNotifier = updateNotifier({pkg: genPkg, updateCheckInterval: 1000 * 60 * 60 * 24});
	const veamsNotifier = updateNotifier({pkg: pkg, updateCheckInterval: 1000 * 60 * 60 * 24});
	const inserterNotifier = updateNotifier({pkg: inserterPkg, updateCheckInterval: 1000 * 60 * 60 * 24});

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

		helpers.message('magenta', helpers.msg.info(message.join(' ')));
	}
}

function getVersions() {
	const message = [];

	message.push(genPkg.name + ': ' + genPkg.version);
	message.push(pkg.name + ': ' + pkg.version);
	message.push(inserterPkg.name + ': ' + inserterPkg.version);

	helpers.message('cyan', message.join('\n'));
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
	extensions: Veams.extensions,
	npmInstall: npmInstall,
	getBlueprintConfig: getBlueprintConfig,
	insertBlueprint: insertBlueprint,
	runGenerator: runGenerator,
	checkUpdateAvailability: checkUpdateAvailability,
	getVersions: getVersions
};