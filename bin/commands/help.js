/* ==============================================
 * Requirements
 * ============================================== */
var Veams = require('../../lib/veams');
var Helpers = require('../../lib/utils/helpers');

var help = '' +
	'Command | Description                                                         |\n' +
	'--------|---------------------------------------------------------------------|\n' +
	'new     | Create a new project or component by passing further options.       |\n' +
	'install | Install veams extensions by providing the name and further options. |\n' +
	'help    | Show the help.                                                      |';

/* ==============================================
 * Export
 * ============================================== */

/**
 * Help output.
 *
 */
module.exports = function () {
	Helpers.message('blue', '\n' + help + '\n');
};