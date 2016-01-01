#!/usr/bin/env node

/* ==============================================
 * Passed arguments
 * ============================================== */
var args = process.argv;
var cmd = args[2] || 'help';
var options = args.splice(3, 3);

/**
 * Represents a file based cli.
 * @module cli
 *
 * @author Sebastian Fitzner
 */
require('./commands/' + cmd)(options);