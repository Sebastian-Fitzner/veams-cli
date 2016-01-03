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

		case Helpers.generatorId.gruntId:
			Helpers.message('yellow', 'Starting ' + Helpers.generatorId.gruntId + ' installation ...');
			Veams.runGenerator(Helpers.generator.grunt, options, Helpers.generatorId.gruntId);
			break;

		case Helpers.generatorId.templatingId:
			Helpers.message('yellow', 'Starting ' + Helpers.generatorId.templatingId + ' installation ...');
			Veams.runGenerator(Helpers.generator.templating, options, Helpers.generatorId.templatingId);
			break;

		default:
			console.log('Sorry, you do not have defined a valid installation argument.');
	}
};