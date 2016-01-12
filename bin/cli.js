#!/usr/bin/env node

/**
 * Represents a file based cli.
 * @module cli
 *
 * @author Sebastian Fitzner
 */

/* ==============================================
 * Requirements
 * ============================================== */
var Helpers = require('../lib/utils/helpers');
var genPkg = require('../node_modules/generator-veams/package.json');
var pkg = require('../package.json');
var updateNotifier = require('update-notifier');
var Chalk = require('chalk');

/* ==============================================
 * Update Notifier
 * ============================================== */
var message = [];
var genNotifier = updateNotifier({pkg: genPkg, updateCheckInterval: 1000 * 60 * 60 * 24});
var veamsNotifier = updateNotifier({pkg: pkg, updateCheckInterval: 1000 * 60 * 60 * 24});

if (genNotifier.update || veamsNotifier.update) {
	message.push(Chalk.gray('Update available for: \n\n'));

	if (genNotifier && genNotifier.update) {
		message.push(Helpers.extensions.generatorId + Chalk.gray(' (') + Chalk.green.bold(genNotifier.update.latest) + Chalk.gray(') - current: ' + genNotifier.update.current + '\n')
		);
	}

	if (veamsNotifier && veamsNotifier.update) {
		message.push(pkg.name + Chalk.gray(' (') + Chalk.green.bold(veamsNotifier.update.latest) + Chalk.gray(') - current: ' + veamsNotifier.update.current + '\n')
		);
	}

	message.push(Chalk.gray('   - Run ' + Chalk.magenta('veams update') + ' to update.\n'));

	Helpers.message('magenta', Helpers.msg.info(message.join(' ')));
}

/* ==============================================
 * Passed arguments
 * ============================================== */
var args = process.argv;
var cmd = args[2] || 'help';
var options = args.splice(3, 3);

require('./commands/' + cmd)(options);