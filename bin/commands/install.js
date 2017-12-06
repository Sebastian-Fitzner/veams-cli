/* ==============================================
 * Requirements
 * ============================================== */
const Veams = require('../../lib/veams');
const helpers = require('../../lib/utils/helpers');


/* ==============================================
 * Helper functions
 * ============================================== */

async function installNpmComponent({registryName, options = '', name, type = 'component'}) {
	if (!name) {
		helpers.message('yellow', helpers.msg.warning('Please provide the name!'));
		return;
	}

	try {
		const config = Veams.getBlueprintConfig({name, type});
		const src = `${process.cwd()}/node_modules/${registryName}`;
		const dest = `${config.path}/${config.name}`;

		Veams
			.npmInstall(registryName, options)
			.then(() => {
				return helpers.copy({
					src,
					dest
				});
			})
			.then(() => {
				Veams.insertBlueprint(dest);
				helpers.message('green', helpers.msg.success(registryName));
			});

	} catch (err) {
		helpers.message('red', helpers.msg.error(err));
	}
}

/* ==============================================
 * Export
 * ============================================== */

/**
 * Install function of extensions.
 *
 * @param {Array} args - Arguments in console
 */
module.exports = async function (args) {
	const extArgument = Veams.DATA.aliases.exts;
	const typeArgument = Veams.DATA.aliases.types;
	let argument = args[0];
	let options = '';
	let registryName = '';

	Veams.DATA.projectConfig();

	if (args.length > 1) {
		argument = args.shift();
		options = args.join(' ');
	}

	argument = extArgument[argument] || typeArgument[argument] || argument;

	switch (argument) {
		case Veams.DATA.aliases.exts.vc:
			const component = args.shift();
			registryName = Veams.extensions.componentId + '-' + component;
			options = args.join(' ');

			helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			await installNpmComponent({
				registryName,
				options,
				name: component,
				type: 'component'
			});

			break;

		case Veams.DATA.aliases.exts.vu:
			const vuName = args.shift();
			registryName = Veams.extensions.utilityId + '-' + vuName;
			options = args.join(' ');

			helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			await installNpmComponent({
				registryName,
				options,
				name: vuName,
				type: 'utility'
			});

			break;

		case Veams.DATA.aliases.types.bp:
			const src = args.shift();
			const type = args[0] || 'component';
			const name = helpers.getLastFolder(bpPath);
			const config = Veams.getBlueprintConfig({name, type});
			const dest = `${config.path}/${config.name}`;

			helpers.message('cyan', 'Starting to install a local blueprint  ...');

			await helpers.copy({
				src,
				dest
			});

			Veams.insertBlueprint(dest);

			break;

		default:
			console.log('Sorry, you do not have defined a valid installation argument.');
	}
};