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
	help: (help) => {
		return `HELP: ${help}`
	},
	success: (item) => {
		return `DONE: ${item} successfully added!`
	}
};

/* ==============================================
 * Path Helpers
 * ============================================== */

helpers.cleanupPath = function (p) {
	if (p !== '') {
		return p.replace(/\/?$/, '/');
	}
};

helpers.getPath = function (file) {
	if (file !== '') {
		return path.dirname(file);
	}
};

/* ==============================================
 * String Helpers
 * ============================================== */

helpers.toCamelCase = function (str) {
	// Lower cases the string
	return str.toLowerCase()
	// Replaces any - or _ characters with a space
		.replace(/[-_]+/g, ' ')
		// Removes any non alphanumeric characters
		.replace(/[^\w\s]/g, '')
		// Uppercases the first character in each group immediately following a space
		// (delimited by spaces)
		.replace(/ (.)/g, function ($1) {
			return $1.toUpperCase();
		})
		// Removes spaces
		.replace(/ /g, '');
};

helpers.hyphenate = function (str) {
	return str.replace(/\s/g, "-").toLowerCase();
};

helpers.capitalizeFirstLetter = function (str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};


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
 */
helpers.copy = function (obj) {
	const src = obj.src;
	const dest = obj.dest;

	return new Promise((resolve, reject) => {
		fsx.copy(src, dest, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(src, dest);
			}
		})
	});
};

helpers.readDir = function (dir) {
	return new Promise((resolve, reject) => {
		fsx.readdir(dir, (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	});
};

helpers.writeFile = function (filepath, data) {
	return new Promise((resolve, reject) => {
		fsx.writeFile(filepath, data, 'utf8', (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(filepath, data);
			}
		});
	});
};

helpers.readFile = function (filepath) {
	return new Promise((resolve, reject) => {
		fsx.readFile(filepath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

helpers.readJSON = function (filepath) {
	return new Promise((resolve, reject) => {
		fsx.readFile(filepath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
};

helpers.write = function (filepath, data) {
	return new Promise((resolve, reject) => {
		mkdirp(path.dirname(filepath), function (err) {
			if (err) reject(err);
			else resolve(helpers.writeFile(filepath, data))
		});
	});
};

helpers.fileExists = function (filepath) {
	return new Promise((resolve, reject) => {
		fsx.stat(filepath, function fsStat(err, fileOrFolder) {
			if (err) {
				if (err.code === 'ENOENT') {
					resolve(false);
				} else {
					reject(err);
				}
			} else {
				resolve(fileOrFolder.isFile());
			}
		});
	});
};

helpers.folderExists = function (filepath) {
	return new Promise((resolve, reject) => {
		fsx.stat(filepath, function fsStat(err, fileOrFolder) {
			if (err) {
				if (err.code === 'ENOENT') {
					resolve(false);
				} else {
					reject(err);
				}
			} else {
				resolve(fileOrFolder.isDirectory());
			}
		});
	});
};

helpers.remove = function (path) {
	return new Promise((resolve, reject) => {
		fsx.remove(path, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(path);
			}
		})
	})
};

helpers.resolveImportPath = function (firstPath, secondPath) {
	let fPath = path.dirname(path.normalize(firstPath));
	let sPath = path.dirname(path.normalize(secondPath));

	return path.relative(fPath, sPath);
};


/* ==============================================
 * Export
 * ============================================== */
module.exports = helpers;
export default helpers;