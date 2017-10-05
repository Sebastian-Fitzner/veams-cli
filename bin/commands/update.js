/* ==============================================
 * Requirements
 * ============================================== */
const Veams = require('../../lib/veams');
const helpers = require('../../lib/utils/helpers');

/* ==============================================
 * Export
 * ============================================== */

/**
 * Update function of extensions.
 */
module.exports = async function update() {
	helpers.message('cyan', 'Updating Veams ...');

	try {
		await Veams.npmInstall('veams-cli -g');
		helpers.message('green', helpers.msg.success('Veams'));

	} catch (err) {
		helpers.message('red', helpers.msg.error(err));
	}
};