/* ==============================================
 * Requirements
 * ============================================== */
var Helpers = require('./utils/helpers');
var exec = require('child_process').exec;
var Yeoman = require('yeoman-environment');
var Env = Yeoman.createEnv();

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
 * @param {String} opts - Further opttions you can pass
 * @param {String} item - item which is scaffolded
 */
function runGenerator(generatorName, opts, item) {
	Env.run(generatorName + ' ' + opts, function (err) {
		if (err) {
			Helpers.message('red', Helpers.msg.error(err));
		} else {
			Helpers.message('green', Helpers.msg.success(item));
		}
	});
}

/* ==============================================
 * Export
 * ============================================== */
module.exports = {
	npmInstall: npmInstall,
	bowerInstall: bowerInstall,
	runGenerator: runGenerator
};