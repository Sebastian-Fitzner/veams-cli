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
	var alias = Veams.DATA.aliases.types;
	var name;
	var goodies;


	if (args.length > 1) {
		type = args.shift();
		name = args.shift();
		goodies = args.join(' ');
	} else {
		Helpers.message('yellow', Helpers.msg.warning('You have to provide a name for the blueprint!'));

		return;
	}

	type = alias[type] || type;


	switch (type) {
		case Veams.DATA.aliases.types.c:
			Helpers.message('cyan', 'Starting to scaffold a new component  ...', Veams.generator);

			Veams.runGenerator(Veams.generators.blueprint, name + ' --component --tmp', name, function () {
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

			Veams.runGenerator(Veams.generators.blueprint, name + ' --block --tmp', name, function () {
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

			Veams.runGenerator(Veams.generators.blueprint, name + ' --utility --tmp', name, function () {
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

		case Veams.DATA.aliases.types.cu:
			Helpers.message('cyan', 'Starting to scaffold a new custom type  ...');

			Veams.runGenerator(Veams.generators.blueprint, name + ' ' + goodies + ' --custom --tmp', name, function () {
				Veams.addBlueprintFiles({
					path: 'tmp/' + name,
					name: name,
					destFolder: goodies,
					type: 'custom',
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