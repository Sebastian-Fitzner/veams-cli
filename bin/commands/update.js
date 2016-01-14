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
	Helpers.message('cyan', 'Updating Veams ...');
	Veams.npmInstall('veams-cli -g');
};