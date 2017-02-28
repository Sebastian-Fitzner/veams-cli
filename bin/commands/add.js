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

	if (type) {
		Helpers.message('cyan', 'Starting to scaffold a new ' + type + '  ...', Veams.generator);

		Veams.runGenerator(Veams.generators.blueprint, name + ' --' + type + ' --tmp --config', name, function () {
			Veams.insertBlueprint('tmp/' + name);
			Helpers.remove('tmp/' + name);
		});
	} else {
		Helpers.message('yellow', Helpers.msg.warning('Sorry, you do not have defined a valid argument for adding a new blueprint.'));
	}
};