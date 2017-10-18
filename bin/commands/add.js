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

	if (args.length > 1) {
		type = args.shift();
		name = args.shift();
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

	const config = Veams.getBlueprintConfig({name, type});
	const fullPath = `${config.path}/${config.name}`;

	try {
		const item = await Veams.runGenerator(Veams.generators.blueprint, `${config.name} ${config.path} --${config.type} --config`, 'name');
		await Veams.updateImportFiles(config.path, config.name);
		Veams.insertBlueprint(fullPath);

		helpers.message('green', helpers.msg.success(`${config.name} was successfully created in ${config.path}/${config.name}`))
	} catch (err) {
		helpers.message('red', helpers.msg.error(err))
	}
};