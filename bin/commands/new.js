/* ==============================================
 * Requirements
 * ============================================== */
var Helpers = require('../../lib/utils/helpers');
var Veams = require('../../lib/veams');
var fsx = require('fs-extra');

/* ==============================================
 * Export function
 * ============================================== */

/**
 * Install function of extensions.
 *
 * @param {Array} args - Arguments in console
 */
module.exports = function (args) {
	var type = args[0];
	var options;
	var alias = Veams.DATA.aliases.types;

	if (args.length > 1) {
		type = args.shift();
		options = args.join(' ');
	}

	type = alias[type] || type;

	switch (type) {
		case Veams.DATA.aliases.types.p:
			Veams.runGenerator(Veams.generators.standard, options, 'Project', function () {
				var setup = JSON.parse(fsx.readFileSync(process.cwd() + '/setup.json', 'utf-8'))['generator-veams'];

				if (setup.veamsPackages.indexOf('veamsJS') !== -1) {

					fsx.stat(Veams.getBowerDir() + '/' + Veams.extensions.jsId, function (err) {
						if (!err) {
							Helpers.copyFile({
								src: Veams.getBowerDir() + '/' + Veams.extensions.jsId + '/global-scss',
								dest: Veams.DATA.projectConfig().paths.scss + '/global',
								msg: true
							});
							Helpers.copyFile({
								src: Veams.getBowerDir() + '/' + Veams.extensions.jsId + '/js',
								dest: Veams.DATA.projectConfig().paths.js,
								msg: true
							});

							Veams.insertBlueprint(Veams.getBowerDir() + '/' + Veams.extensions.jsId + '/README.md');

							Helpers.message('green', Helpers.msg.success(Veams.extensions.jsId));
						} else {
							Helpers.message('red', Helpers.msg.warning('You have not downloaded the bower component ' + Veams.extensions.jsId + '. But you can also install ' + Veams.extensions.jsId + 'later with Veams!'));
						}
					});

				}
			});
			break;

		case Veams.DATA.aliases.types.bp:
			if (!options) {
				return Helpers.message('yellow', Veams.msg.warning('You have to provide a name for your blueprint!'));
			}

			Helpers.message('cyan', 'Starting to scaffold a new blueprint  ...');

			Veams.runGenerator(Veams.generators.blueprint, options, 'Blueprint');
			break;

		default:
			Helpers.message('yellow', Helpers.msg.warning('Sorry, you do not have defined a valid argument for a new scaffold.'));
	}
};