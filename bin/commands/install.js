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

		await Veams.npmInstall(registryName, options);
		await helpers.copy({
			src,
			dest
		});

		Veams.insertBlueprint(dest);

		helpers.message('green', helpers.msg.success(registryName));
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
module.exports = function (args) {
	var argument = args[0];
	var options = '';
	var registryName = '';
	var extArgument = Veams.DATA.aliases.exts;
	var typeArgument = Veams.DATA.aliases.types;

	Veams.DATA.bowerDir();
	Veams.DATA.projectConfig();

	if (args.length > 1) {
		argument = args.shift();
		options = args.join(' ');
	}

	argument = extArgument[argument] || typeArgument[argument] || argument;

	switch (argument) {
		case Veams.extensions.componentsId:
			helpers.message('cyan', 'Downloading all ' + Veams.extensions.componentsId + ' ...');
			Veams.bowerInstall(Veams.extensions.componentsId, options);
			break;

		case Veams.DATA.aliases.exts.vc:
			var component = args.shift();
			registryName = Veams.extensions.componentId + '-' + component;
			options = args.join(' ');

			helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			installBowerComponent({
				registryName: registryName,
				options: options,
				name: component,
				type: 'component'
			});

			break;

		case Veams.DATA.aliases.exts.vu:
			var vuName = args.shift();
			registryName = Veams.extensions.utilityId + '-' + vuName;
			options = args.join(' ');

			helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			installBowerComponent({
				registryName: registryName,
				options: options,
				name: vuName,
				type: 'utility'
			});

			break;

		case Veams.DATA.aliases.exts.bc:
			registryName = args.shift();
			options = args.join(' ');
			var bcName = args[0];
			var type = args[1] || '';

			helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			installBowerComponent({
				registryName: registryName,
				name: bcName,
				type: type
			});

			break;

		case Veams.DATA.aliases.types.bp:
			var bpPath = args.shift();
			var bpType = args[0] || 'component';
			var bpName = helpers.getLastFolder(bpPath);

			helpers.message('cyan', 'Starting to install a local blueprint  ...');

			Veams.addBlueprintFiles({
				path: bpPath,
				name: bpName,
				type: bpType
			});
			Veams.insertBlueprint(bpPath);

			break;

			defaulconst
			console.log('Sorry, you do not have defined a valid installation argument.');
	}
};