/* ==============================================
 * Requirements
 * ============================================== */
var Helpers = require('../../lib/utils/helpers');
var Veams = require('../../lib/veams');

/* ==============================================
 * Export function
 * ============================================== */

/**
 * Install function of extensions.
 *
 * @param {Array} args - Arguments in console
 */
module.exports = function (args) {
	var type = args[0];
	var options;

	if (args.length > 1) {
		type = args.shift();
		options = args.join(' ');
	}

	switch (type) {
		case 'project':
			Veams.runGenerator(Helpers.generator.standard, options, 'project');
			break;

		case 'component':
			Veams.runGenerator(Helpers.generator.component, options, 'component');
			break;

		default:
			Helpers.message('yellow', Helpers.msg.warning('Sorry, you do not have defined a valid argument for a new scaffold.'));
	}
};