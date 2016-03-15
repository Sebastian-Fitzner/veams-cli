/* ==============================================
 * Requirements
 * ============================================== */
var Helpers = require('../../lib/utils/helpers');
var Veams = require('../../lib/veams');

/* ==============================================
 * Export function
 * ============================================== */

/**
 * Install extensions.
 *
 * @param {Array} args - Arguments in bash
 */
module.exports = function (args) {
	var type = args[0];
	var name;
	var alias = Veams.DATA.aliases.types;


	if (args.length > 1) {
		type = args.shift();
		name = args.join(' ');
	} else {
		Helpers.message('yellow', Helpers.msg.warning('You have to provide a name for the blueprint!'));

		return;
	}

	type = alias[type] || type;


	switch (type) {
		case Veams.DATA.aliases.types.c:
			Helpers.message('cyan', 'Starting to scaffold a new component  ...');

			Veams.runGenerator(Helpers.generator.blueprint, name + ' --component --tmp', name, function () {
				Veams.addBlueprintFiles({
					path: 'tmp/' + name,
					name: name,
					type: 'component',
					cb: function () {
						Helpers.remove('tmp/' + name);
					}
				});
				Veams.insertBlueprint('tmp/' + name);
			});
			break;

		case Veams.DATA.aliases.types.b:
			Helpers.message('cyan', 'Starting to scaffold a new block  ...');

			Veams.runGenerator(Helpers.generator.blueprint, name + ' --block --tmp', name, function () {
				Veams.addBlueprintFiles({
					path: 'tmp/' + name,
					name: name,
					type: 'block',
					cb: function () {
						Helpers.remove('tmp/' + name);
					}
				});
				Veams.insertBlueprint('tmp/' + name);
			});
			break;

		case Veams.DATA.aliases.types.u:
			Helpers.message('cyan', 'Starting to scaffold a new utility  ...');

			Veams.runGenerator(Helpers.generator.blueprint, name + ' --utility --tmp', name, function () {
				Veams.addBlueprintFiles({
					path: 'tmp/' + name,
					name: name,
					type: 'utility',
					cb: function () {
						Helpers.remove('tmp/' + name);
					}
				});
				Veams.insertBlueprint('tmp/' + name);
			});
			break;

		default:
			Helpers.message('yellow', Helpers.msg.warning('Sorry, you do not have defined a valid argument for adding a new blueprint.'));
	}
};