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
var Veams = require('../lib/veams');

/* ==============================================
 * Update Notifier
 * ============================================== */
Veams.checkUpdateAvailability();

/* ==============================================
 * Passed arguments
 * ============================================== */
var args = process.argv;
var cmd = args[2] || 'help';
var options = args.slice(3);
var alias = Veams.DATA.aliases.cmds;

if (cmd.length === 2) {
	cmd = alias[cmd.split('-')[1]] || cmd;
}

try {
	require('./commands/' + cmd)(options);
} catch (e) {
	Helpers.message('red', 'ERROR: UNKNOWN_COMMAND\n' + e);
	require('./commands/help')();
}