/* ==============================================
 * Requirements
 * ============================================== */
var path = require('path');
var chalk = require('chalk');
var fsx = require('fs-extra');

/* ==============================================
 * Variables
 * ============================================== */
var marker = '\n==================================================\n';

/**
 * Represents a Helpers object.
 * @module Helpers object
 *
 * @author Sebastian Fitzner
 */
var Helpers = {};

/**
 * Messages
 */
Helpers.msg = {
	error: function (error, stderr) {
		return 'ERROR: Something goes wrong! Please open an issue on github with the following error code: \n\n' + chalk.magenta(error) || chalk.magenta(stderr) + '\n'
	},
	warning: function (warning) {
		return 'WARNING: ' + warning
	},
	info: function (info) {
		return 'INFORMATION: ' + info
	},
	success: function (item) {
		return 'DONE: ' + item + ' successfully added!'
	}
};


/* ==============================================
 * Functions
 * ============================================== */

/**
 * Log messages to the console.
 *
 * @param {String} color - Define the color of message (see chalk.js).
 * @param {String} msg - Message which will be displayed.
 */
Helpers.message = function (color, msg) {
	console.log(
		chalk[color](marker) +
		chalk[color](msg) +
		chalk[color](marker)
	);
};

/**
 * Get last folder
 */
Helpers.getLastFolder = function (p) {
	return p.split(path.sep).pop();
};

/**
 * Remove files or folder.
 *
 * @param {String} path - File
 */
Helpers.remove = function (path) {
	fsx.remove(path, function (err) {
		if (err) return console.error(err);

		Helpers.message('cyan', Helpers.msg.info(path + ' folder was created and successfully deleted!'));
	})
};

Helpers.extend = function (a, b) {
	for (var key in b) {
		if (b.hasOwnProperty(key)) {
			a[key] = b[key];
		}
	}
	return a;
};

Helpers.deepExtend = function (destination, source) {
	for (var property in source) {
		if (source[property] && source[property].constructor &&
			source[property].constructor === Object) {
			destination[property] = destination[property] || {};
			arguments.callee(destination[property], source[property]);
		} else {
			destination[property] = source[property];
		}
	}
	return destination;
};

/**
 * Copy file to specific destination.
 *
 * @param {Object} obj - object contains all paths
 * @param {Object} obj.src - root path of files
 * @param {String} obj.dest - destination path of files
 * @param {Boolean}obj.msg - control display of message
 */
Helpers.copyFile = function(obj) {
	var src = obj.src;
	var dest = obj.dest;
	var msg = obj.msg;

	try {
		fsx.copySync(src, dest);

		if (msg) {
			Helpers.message('green', Helpers.msg.success('Files in ' + src + ' '));
		}

	} catch (err) {
		if (msg) {
			Helpers.message('red', Helpers.msg.error(err.message));
		}
	}
}

/* ==============================================
 * Export
 * ============================================== */
module.exports = Helpers;