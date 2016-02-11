/* ==============================================
 * Requirements
 * ============================================== */
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var Veams = require('../../lib/veams');
var Helpers = require('../../lib/utils/helpers');

/* ==============================================
 * Export
 * ============================================== */

/**
 * Help output.
 */
module.exports = function () {
	console.log(chalk.cyan('\n' + fs.readFileSync(path.join(__dirname, '../../help.txt'), 'utf8')));
};