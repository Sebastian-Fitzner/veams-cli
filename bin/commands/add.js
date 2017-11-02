/* ==============================================
 * Requirements
 * ============================================== */
const Veams = require('../../lib/veams');
const helpers = require('../../lib/utils/helpers');

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
	const projectConfig = Veams.DATA.projectConfig();
	const projectType = projectConfig.projectType;
	let skip = args.indexOf('--skip-imports') !== -1 || args.indexOf('--si') !== -1;
	let type = args[0];
	let name;

	if (projectConfig.blueprints && projectConfig.blueprints[type]) {
		skip = projectConfig.blueprints[type] || skip;
	}

	if (args.length > 1) {
		type = args.shift();
		name = args.shift();
	} else {
		helpers.message('gray', helpers.msg.help('You have to provide the type and name for the blueprint!'));
		return;
	}

	type = alias[type] || type;

	if (!type) {
		helpers.message('yellow', helpers.msg.warning('Sorry, you do not have defined a valid argument for adding a new blueprint.'));
		return;
	}

	helpers.message('cyan', 'Starting to scaffold a new ' + type + '  ...');

	const config = Veams.getBlueprintConfig({name, type});
	const fullPath = `${config.path}/${config.name}`;

	try {
		let skipFilesOption = skip ? '--skipDefaults' : '';
		await Veams.runGenerator(Veams.generators.blueprint, `${config.type} ${config.name} ${config.path} --config ${skipFilesOption}`, `${config.name}`);

		if (!skip) {
			await Veams.updateImportFiles(config.path, config.name);
			Veams.insertBlueprint(fullPath);

			if (projectType === 'single-page-app') {
				await Veams.deleteDefaultFiles(config.path);
			}
		}

		helpers.message('green', helpers.msg.success(`${config.name} was successfully created in ${config.path}/${config.name}`))
	} catch (err) {
		helpers.message('red', helpers.msg.error(err))
	}
};