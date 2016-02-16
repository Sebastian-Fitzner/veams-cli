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
	var alias = Veams.DATA.aliases.types;

	if (args.length > 1) {
		type = args.shift();
		options = args.join(' ');
	}

	type = alias[type] || type;

	switch (type) {
		case Veams.DATA.aliases.types.p:
			Veams.runGenerator(Helpers.generator.standard, options, 'Project');
			break;

		case Veams.DATA.aliases.types.bp:
			if (!options) {
				return Helpers.message('yellow', Helpers.msg.warning('You have to provide a name for your blueprint!'));
			}

			Helpers.message('cyan', 'Starting to scaffold a new blueprint  ...');

			Veams.runGenerator(Helpers.generator.blueprint, options, 'Blueprint');
			break;

		default:
			Helpers.message('yellow', Helpers.msg.warning('Sorry, you do not have defined a valid argument for a new scaffold.'));
	}
};