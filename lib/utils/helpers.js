/* ==============================================
 * Requirements
 * ============================================== */
var chalk = require('chalk');

/* ==============================================
 * Variables
 * ============================================== */
const marker = '==================================================\n';

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
		return 'DONE: Installation of ' + item + ' successful!'
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
	standard: 'veams',
	component: 'veams:components',
	grunt: 'veams:grunt',
	templating: 'veams:templating',
	js: 'veams:js'
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
		chalk[color](msg + '\n') +
		chalk[color](marker)
	);
};

/* ==============================================
 * Export
 * ============================================== */
module.exports = Helpers;