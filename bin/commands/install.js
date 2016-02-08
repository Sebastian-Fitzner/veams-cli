/* ==============================================
 * Requirements
 * ============================================== */
var Veams = require('../../lib/veams');
var Helpers = require('../../lib/utils/helpers');

/* ==============================================
 * Export
 * ============================================== */

/**
 * Install function of extensions.
 *
 * @param {Array} args - Arguments in console
 */
module.exports = function (args) {
	var extension = args[0];
	var options = '';

	Veams.DATA.bowerDir();
	Veams.DATA.projectConfig();

	if (args.length > 1) {
		extension = args.shift();
		options = args.join(' ');
	}

	switch (extension) {
		case Helpers.extensions.componentsId:
			Helpers.message('cyan', 'Downloading all ' + Helpers.extensions.componentsId + ' ...');
			Veams.bowerInstall(Helpers.extensions.componentsId, options);
			break;

		case Helpers.extensions.componentId:
			var component = args.shift();
			var registryName = Helpers.extensions.componentId + '-' + component;
			options = args.join(' ');

			Helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			Veams.bowerInstall(registryName, options, function (error, stdout, stderr) {
				if (error) {
					Helpers.message('red', Helpers.msg.error(error, stderr));
				} else {
					Helpers.message('gray', stdout);

					Veams.addBlueprintFiles(Veams.getBowerDir() + '/' + registryName, component);
					Veams.insertBlueprint(Veams.getBowerDir() + '/' + registryName);
					Helpers.message('green', Helpers.msg.success(registryName));
				}
			});

			break;

		case 'blueprint':
			var bpPath = args.shift();
			var bpType = args[0] || 'component';
			var bpName = Helpers.getLastFolder(bpPath);

			Helpers.message('cyan', 'Starting to scaffold a new blueprint  ...');

			Veams.addBlueprintFiles(bpPath, bpName, bpType);
			Veams.insertBlueprint(bpPath);

			break;

		case Helpers.extensions.jsId:
			Helpers.message('cyan', 'Downloading ' + Helpers.extensions.jsId + ' ...');
			Veams.bowerInstall(Helpers.extensions.jsId, options, function (error, stdout, stderr) {
				if (error) {
					Helpers.message('red', Helpers.msg.error(error, stderr));
				} else {
					Helpers.message('gray', stdout);

					Veams.copyFile(Veams.getBowerDir() + '/' + Helpers.extensions.jsId + '/global-scss', Veams.DATA.projectConfig().paths.scss + '/global', true);
					Veams.copyFile(Veams.getBowerDir() + '/' + Helpers.extensions.jsId + '/js', Veams.DATA.projectConfig().paths.js, true);

					Helpers.message('green', Helpers.msg.success(Helpers.extensions.jsId));
				}
			});
			break;

		case Helpers.generatorId.gruntId:
			Helpers.message('cyan', 'Starting ' + Helpers.generatorId.gruntId + ' installation ...');
			Veams.runGenerator(Helpers.generator.grunt, options, Helpers.generatorId.gruntId);
			break;

		case Helpers.generatorId.templatingId:
			Helpers.message('cyan', 'Starting ' + Helpers.generatorId.templatingId + ' installation ...');
			Veams.runGenerator(Helpers.generator.templating, options, Helpers.generatorId.templatingId);
			break;

		default:
			console.log('Sorry, you do not have defined a valid installation argument.');
	}
};