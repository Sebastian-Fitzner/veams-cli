/* ==============================================
 * Requirements
 * ============================================== */
const helpers = require('../../lib/utils/helpers');
const Veams = require('../../lib/veams');

/* ==============================================
 * Export function
 * ============================================== */

/**
 * Install extensions.
 *
 * @param {Array} args - Arguments in bash
 */
module.exports = async function add(args) {
	const alias = Veams.DATA.aliases.types;
	let type = args[0];
	let name;
	let goodies;


	if (args.length > 1) {
		type = args.shift();
		name = args.shift();
		goodies = args.join(' ');
	} else {
		helpers.message('gray', helpers.msg.help('You have to provide a name for the blueprint!'));
		return;
	}

	type = alias[type] || type;

	if (!type) {
		helpers.message('yellow', helpers.msg.warning('Sorry, you do not have defined a valid argument for adding a new blueprint.'));
		return;
	}

	helpers.message('cyan', 'Starting to scaffold a new ' + type + '  ...', Veams.generator);
	let config = Veams.getBlueprintConfig({name, type});

	try {
		await Veams.runGenerator(Veams.generators.blueprint, `${config.name} ${config.path} --${config.type} --config`, 'name');
		Veams.insertBlueprint(`${config.path}/${config.name}`);

		helpers.message('green', helpers.msg.success(`${config.name} was successfully created in ${config.path}/${config.name}`))
	} catch (err) {
		helpers.message('red', helpers.msg.error(err))
	}
};