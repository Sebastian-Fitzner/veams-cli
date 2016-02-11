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
var chalk = require('chalk');

/* ==============================================
 * Update Notifier
 * ============================================== */
//Veams.checkUpdateAvailability();

/* ==============================================
 * Passed arguments
 * ============================================== */
var args = process.argv;
var cmd = args[2] || 'help';
var options = args.splice(3, 3);
var alias = {
	a: 'add',
	h: 'help',
	i: 'install',
	n: 'news',
	u: 'update',
	v: 'version'
};

if (cmd.length === 2) {
	cmd = alias[cmd.split('-')[1]] || cmd;
}

try {
	require('./commands/' + cmd)(options);
} catch (e) {
	Helpers.message('red', '\nERROR: UNKNOWN_COMMAND\n');
	require('./commands/help')();
}