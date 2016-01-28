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
var options = args.splice(3, 3);

require('./commands/' + cmd)(options);