let gonzales = require('gonzales-pe');

module.exports = (content, resolvedPath) => {
	let importStr = `@import "${resolvedPath}";\n`;

	return parseContents([content, importStr])
		.then(parsedTrees => addImport(parsedTrees[0], parsedTrees[1]));
};

function parseContents(content = []) {
	let parsedContent = [];

	for (let i = 0; i < content.length; i++ ) {
		parsedContent.push(parse(content[i]));
	}

	return Promise.all(parsedContent);
}

function parse(content) {
	return new Promise((resolve, reject) => {
		resolve(gonzales.parse(content, {syntax: 'scss'}));
	});
}

function addImport(parsedFile, parsedPath) {
	let idx;
	let alreadyDefined = false;

	parsedFile.traverse((node, index) => {
		if (node.is('atrule')) {
			idx = index;
			alreadyDefined = false;
		}

		if (idx && idx < index && !alreadyDefined) {
			if (node.content == '\n') {
				idx = index;
				alreadyDefined = true;
			}
		}
	});

	if (idx) {
		parsedFile.insert(idx + 1, parsedPath);
	} else {
		parsedFile.content.push(parsedPath);
	}

	return new Promise((resolve, reject) => {
		resolve(parsedFile.toString());
	});
}