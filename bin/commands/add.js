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
	var name;

	if (args.length > 1) {
		type = args.shift();
		name = args.join(' ');
	} else {
		Helpers.message('yellow', Helpers.msg.warning('You have to provide a name for the blueprint!'));

		return;
	}

	switch (type) {
		case 'component':
			Helpers.message('cyan', 'Starting to scaffold a new component  ...');

			Veams.runGenerator(Helpers.generator.blueprint, name + ' --component --tmp', name, function () {
				Veams.addBlueprintFiles('tmp/' + name, 'component');
				Veams.insertBlueprint('tmp/' + name);
			});
			break;

		case 'block':
			Helpers.message('cyan', 'Starting to scaffold a new block  ...');

			Veams.runGenerator(Helpers.generator.blueprint, name + ' --block --tmp', name, function () {
				Veams.addBlueprintFiles('tmp/' + name, 'block');
				Veams.insertBlueprint('tmp/' + name);
			});
			break;

		default:
			Helpers.message('yellow', Helpers.msg.warning('Sorry, you do not have defined a valid argument for adding a new blueprint.'));
	}
};