/* ==============================================
 * Requirements
 * ============================================== */
const path = require('path');
const chalk = require('chalk');
const fsx = require('fs-extra');
const mkdirp = require('mkdirp');

/* ==============================================
 * Variables
 * ============================================== */
const marker = '\n==================================================\n';

/**
 * Represents a helpers object.
 * @module helpers object
 *
 * @author Sebastian Fitzner
 */
const helpers = {};

/**
 * Messages
 */
helpers.msg = {
	error: (error, stderr) => {
		return `ERROR: Something goes wrong! Please open an issue on github with the following error code:
				${chalk.magenta(error) || chalk.magenta(stderr)}
				`
	},
	warning: (warning) => {
		return `WARNING: ${warning}`
	},
	info: (info) => {
		return `INFORMATION: ${info}`
	},
	success: (item) => {
		return `DONE: ${item} successfully added!`
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
helpers.message = function (color, msg) {
	console.log(
		chalk[color](marker) +
		chalk[color](msg) +
		chalk[color](marker)
	);
};

/**
 * Get last folder
 *
 * @param {String} p - Path.
 */
helpers.getLastFolder = function (p) {
	return p.split(path.sep).pop();
};

/**
 * Remove files or folder.
 *
 * @param {String} path - File
 */
helpers.remove = function (path) {
	fsx.remove(path, function (err) {
		if (err) return console.error(err);

		helpers.message('cyan', helpers.msg.info(`${path} folder was created and successfully deleted!`));
	})
};

helpers.extend = function (a, b) {
	for (let key in b) {
		if (b.hasOwnProperty(key)) {
			a[key] = b[key];
		}
	}
	return a;
};

helpers.deepExtend = function (destination, source) {
	for (let property in source) {
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
helpers.copyFile = function (obj) {
	const src = obj.src;
	const dest = obj.dest;
	const msg = obj.msg;

	try {
		fsx.copySync(src, dest);

		if (msg) {
			helpers.message('green', helpers.msg.success('Files in ' + src + ' '));
		}

	} catch (err) {
		if (msg) {
			helpers.message('red', helpers.msg.error(err.message));
		}
	}
};

helpers.readFile = (filepath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

helpers.write = (filepath, data) => {
	return new Promise((resolve, reject) => {
		mkdirp(path.dirname(filepath), function (err) {
			if (err) reject(err);
			else resolve(helpers.writeFile(filepath, data))
		});
	});
};

helpers.writeFile = (filepath, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(filepath, data, 'utf8', (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(filepath, data);
			}
		});
	});
};

/* ==============================================
 * Export
 * ============================================== */
module.exports = helpers;