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
	var extension = args[0];
	var options = '';
	var registryName = '';
	var alias = Veams.DATA.aliases.exts;

	Veams.DATA.bowerDir();
	Veams.DATA.projectConfig();

	if (args.length > 1) {
		extension = args.shift();
		options = args.join(' ');
	}

	extension = alias[extension] || extension;

	switch (extension) {
		case Helpers.extensions.componentsId:
			Helpers.message('cyan', 'Downloading all ' + Helpers.extensions.componentsId + ' ...');
			Veams.bowerInstall(Helpers.extensions.componentsId, options);
			break;

		case Veams.DATA.aliases.exts.vc:
			var component = args.shift();
			registryName = Helpers.extensions.componentId + '-' + component;
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
			var name = args.shift();
			registryName = Helpers.extensions.componentId + '-' + name;
			options = args.join(' ');

			Helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			installBowerComponent({
				registryName: registryName,
				options: options,
				name: name,
				type: 'utility'
			});

			break;

		case Veams.DATA.aliases.exts.bc:
			registryName = args.shift();
			options = args.join(' ');
			var name = args[0];
			var type = args[1] || '';

			Helpers.message('cyan', 'Downloading ' + registryName + ' ...');

			installBowerComponent({
				registryName: registryName,
				name: name,
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

		case Veams.DATA.aliases.exts.vjs:
			Helpers.message('cyan', 'Downloading ' + Helpers.extensions.jsId + ' ...');
			Veams.bowerInstall(Helpers.extensions.jsId, options, function (error, stdout, stderr) {

				if (error) {
					Helpers.message('red', Helpers.msg.error(error, stderr));
				} else {
					Helpers.message('gray', stdout);

					Veams.npmInstall('respimage jquery exoskeleton underscore touchswipe', '--save', function (err, stdout, stderr) {
						if (err) {
							Helpers.message('red', Helpers.msg.error(err, stderr));
						} else {
							Helpers.message('gray', stdout);

							Veams.copyFile({
								src: Veams.getBowerDir() + '/' + Helpers.extensions.jsId + '/global-scss',
								dest: Veams.DATA.projectConfig().paths.scss + '/global',
								msg: true
							});
							Veams.copyFile({
								src: Veams.getBowerDir() + '/' + Helpers.extensions.jsId + '/js',
								dest: Veams.DATA.projectConfig().paths.js,
								msg: true
							});

							Helpers.message('green', Helpers.msg.success(Helpers.extensions.jsId));
						}
					});
				}
			});
			break;

		case Veams.DATA.aliases.exts.gm:
			Helpers.message('cyan', 'Starting ' + Helpers.generatorId.gruntId + ' installation ...');
			Veams.runGenerator(Helpers.generator.grunt, options, Helpers.generatorId.gruntId);
			break;

		case Veams.DATA.aliases.exts.th:
			Helpers.message('cyan', 'Starting ' + Helpers.generatorId.templatingId + ' installation ...');
			Veams.runGenerator(Helpers.generator.templating, options, Helpers.generatorId.templatingId);
			break;

		default:
			console.log('Sorry, you do not have defined a valid installation argument.');
	}
};