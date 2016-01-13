/* ==============================================
 * Requirements
 * ============================================== */
var path = require('path');
var chalk = require('chalk');

/* ==============================================
 * Variables
 * ============================================== */
var marker = '\n==================================================\n';
var generatorPath = 'generator-veams/generators/';

/**
 * Represents a Helpers object.
 * @module Helpers object
 *
 * @author Sebastian Fitzner
 */
var Helpers = {};

/**
 * Messages
 */
Helpers.msg = {
	error: function (error, stderr) {
		return 'ERROR: Something goes wrong! Please open an issue on github with the following error code: \n\n' + error || stderr + '\n'
	},
	warning: function (warning) {
		return 'WARNING: ' + warning
	},
	info: function (info) {
		return 'INFORMATION: ' + info
	},
	success: function (item) {
		return 'DONE: ' + item + ' successfully added!'
	}
};

/**
 * Extension ID's
 */
Helpers.extensions = {
	generatorId: 'veams-generator',
	componentId: 'veams-component',
	componentsId: 'veams-components',
	jsId: 'veams-js',
	methdologyId: 'veams-methodology'
};

/**
 * Generators
 */
Helpers.generator = {
	standard: 'veams:app',
	component: 'veams:blueprint',
	grunt: 'veams:grunt',
	templating: 'veams:templating',
	js: 'veams:js'
};

Helpers.generatorPath = [
	{
		path: generatorPath + 'app',
		cmd: Helpers.generator.standard
	},
	{
		path: generatorPath + 'blueprint',
		cmd: Helpers.generator.blueprint
	},
	{
		path: generatorPath + 'grunt',
		cmd: Helpers.generator.grunt
	},
	{
		path: generatorPath + 'templating',
		cmd: Helpers.generator.templating
	},
	{
		path: generatorPath + 'js',
		cmd: Helpers.generator.js
	}
];

Helpers.generatorId = {
	gruntId: 'grunt-module',
	templatingId: 'template-helper',
	jsId: 'js-module'
};

/* ==============================================
 * Functions
 * ============================================== */

/**
 * Log messages to the console.
 *
 * @param {String} color - Define the color of message (see chalk.js).
 * @param {String} msg - Message which will be displayed.
 */
Helpers.message = function (color, msg) {
	console.log(
		chalk[color](marker) +
		chalk[color](msg) +
		chalk[color](marker)
	);
};

/**
 * Get last folder
 */
Helpers.getLastFolder = function (p) {
	return p.split(path.sep).pop();
};

/* ==============================================
 * Export
 * ============================================== */
module.exports = Helpers;