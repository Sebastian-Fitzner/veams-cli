/* ==============================================
 * Requirements
 * ============================================== */
var Veams = require('../../lib/veams');
var Helpers = require('../../lib/utils/helpers');


/* ==============================================
 * Helper functions
 * ============================================== */

function installBowerComponent(obj) {
	var registryName = obj.registryName;
	var options = obj.options || '';
	var name = obj.name;
	var type = obj.type || 'component';

	if (!name) {
		Helpers.message('yellow', Helpers.msg.warning('Please provide a name!'));
		return;
	}

	Veams.bowerInstall(registryName, options, function (error, stdout, stderr) {
		if (error) {
			Helpers.message('red', Helpers.msg.error(error, stderr));
		} else {
			Helpers.message('gray', 'Veams-JS with all dependencies installed!');

			Veams.addBlueprintFiles({
				path: Veams.getBowerDir() + '/' + registryName,
				name: name,
				type: type
			});
			Veams.insertBlueprint(Veams.getBowerDir() + '/' + registryName);
			Helpers.message('green', Helpers.msg.success(registryName));
		}
	});
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
			Helpers.message('cyan', 'Downloading all ' + Veams.extensions.componentsId + ' ...');
			Veams.bowerInstall(Veams.extensions.componentsId, options);
			break;

		case Veams.DATA.aliases.exts.vc:
			var component = args.shift();
			registryName = Veams.extensions.componentId + '-' + component;
			options = args.join(' ');

			Helpers.message('cyan', 'Downloading ' + registryName + ' ...');

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

			Helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			installBowerComponent({
				registryName: registryName,
				options: options,
				name: vuName,
				type: 'utility'
			});

			break;

		case Veams.DATA.aliases.exts.vb:
			var vbName = args.shift();
			registryName = Veams.extensions.blockId + '-' + vbName;
			options = args.join(' ');

			Helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			installBowerComponent({
				registryName: registryName,
				options: options,
				name: vbName,
				type: 'block'
			});

			break;

		case Veams.DATA.aliases.exts.bc:
			registryName = args.shift();
			options = args.join(' ');
			var bcName = args[0];
			var type = args[1] || '';

			Helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			installBowerComponent({
				registryName: registryName,
				name: bcName,
				type: type
			});

			break;

		case Veams.DATA.aliases.types.bp:
			var bpPath = args.shift();
			var bpType = args[0] || 'component';
			var bpName = Helpers.getLastFolder(bpPath);

			Helpers.message('cyan', 'Starting to install a local blueprint  ...');

			Veams.addBlueprintFiles({
				path: bpPath,
				name: bpName,
				type: bpType
			});
			Veams.insertBlueprint(bpPath);

			break;

		default:
			console.log('Sorry, you do not have defined a valid installation argument.');
	}
};