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
	var options;

	if (args.length > 1) {
		extension = args.shift();
		options = args.join(' ');
	}

	switch (extension) {

		case Helpers.extensions.generatorId:
			Helpers.message('yellow', 'Installing ' + Helpers.extensions.generatorId + ' ...');
			Veams.npmInstall('generator-veams', options);
			break;

		case Helpers.extensions.componentsId:
			Helpers.message('yellow', 'Downloading all ' + Helpers.extensions.componentsId + ' ...');
			Veams.bowerInstall(Helpers.extensions.componentsId, options);
			break;

		case Helpers.extensions.componentId:
			var component = Helpers.extensions.componentId + '-' + args.shift();
			options = args.join(' ');

			Helpers.message('yellow', 'Downloading ' + component + ' ...');
			Veams.bowerInstall(component, options);
			break;

		case Helpers.extensions.jsId:
			Helpers.message('yellow', 'Downloading ' + Helpers.extensions.jsId + ' ...');
			Veams.bowerInstall(Helpers.extensions.jsId, options);
			break;

		default:
			console.log('Sorry, you do not have defined a valid installation argument.');
	}
};