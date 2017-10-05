/* ==============================================
 * Requirements
 * ============================================== */
const fsx = require('fs-extra');
const helpers = require('../../lib/utils/helpers');
const Veams = require('../../lib/veams');

/* ==============================================
 * Export function
 * ============================================== */

/**
 * Install function of extensions.
 *
 * @param {Array} args - Arguments in console
 */
module.exports = async function (args) {
	const alias = Veams.DATA.aliases.types;
	let type = args[0];
	let options;

	if (args.length > 1) {
		type = args.shift();
		options = args.join(' ');
	}

	type = alias[type] || type;

	switch (type) {
		case Veams.DATA.aliases.types.p:
			Veams.runGenerator(Veams.generators.standard, options, 'Project', function () {
			});
			break;

		case Veams.DATA.aliases.types.bp:
			if (!options) {
				return helpers.message('yellow', helpers.msg.warning('You have to provide a name for your blueprint!'));
			}

			try {
				helpers.message('cyan', 'Starting to scaffold a new blueprint  ...');
				await Veams.runGenerator(Veams.generators.blueprint, `${options} --config`, 'Blueprint');
				helpers.message('green', helpers.msg.success(`Blueprint`));
			} catch (err) {
				helpers.message('red', helpers.msg.error(err));
			}

			break;

		default:
			helpers.message('yellow', helpers.msg.warning('Sorry, you do not have defined a valid argument for a new scaffold.'));
	}
};