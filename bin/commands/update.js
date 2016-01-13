/* ==============================================
 * Requirements
 * ============================================== */
var Veams = require('../../lib/veams');
var Helpers = require('../../lib/utils/helpers');

/* ==============================================
 * Export
 * ============================================== */

/**
 * Update function of extensions.
 */
module.exports = function () {
	Helpers.message('yellow', 'Updating Veams ...');
	Veams.npmInstall('veams-cli -g');
};