#!/usr/bin/env node
/**
 * ES Support
 */
require('babel-core/register');

/**
 * Represents a file based cli.
 * @module cli
 *
 * @author Sebastian Fitzner
 */

/* ==============================================
 * Requirements
 * ============================================== */
const Helpers = require('../lib/utils/helpers');
const Veams = require('../lib/veams');

/* ==============================================
 * Update Notifier
 * ============================================== */
Veams.checkUpdateAvailability();

/* ==============================================
 * Passed arguments
 * ============================================== */
const args = process.argv;
let cmd = args[2] || 'help';
const options = args.slice(3);
const alias = Veams.DATA.aliases.cmds;

if (cmd.length === 2) {
	cmd = alias[cmd.split('-')[1]] || cmd;
}

try {
	require('./commands/' + cmd)(options);
} catch (e) {
	Helpers.message('red', `ERROR: UNKNOWN_COMMAND\n ${e}`);
	require('./commands/help')();
}