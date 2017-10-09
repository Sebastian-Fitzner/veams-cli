const babel = require('babel-core');
const prettier = require('prettier');
let opts = {};

// use custom plugin to transform the source
module.exports = (file, options) => {
	opts = options;
	let code = babel.transform(file, {
		plugins: [
			importer
		]
	}).code;

	return prettier.format(code, {
		'printWidth': 80,
		'tabWidth': 4,
		'useTabs': true,
		'semi': true,
		'singleQuote': true,
		'trailingComma': 'none',
		'bracketSpacing': true,
		'jsxBracketSameLine': false,
		'parser': 'babylon'
	});
};

function importer({types: t}) {
	let currentIdx = 0;
	let importLength = 0;

	return {
		visitor: {
			ImportDeclaration(path, state) {
				const body = path.parent.body;

				if (currentIdx < 1) {
					for (const item of body) {
						if (item.type === 'ImportDeclaration') {
							importLength += 1;
						}
					}
				}

				currentIdx += 1;

				if (currentIdx !== importLength) return;

				const specifiers = path.node.specifiers;
				const src = path.node.source.value;
				const importDeclaration = makeImport(t, opts.clName, opts.path);
				const replacements = [];

				if (specifiers.length > 0) {
					const names = [];

					for (const specifier of specifiers) {
						names.push(specifier.local.name);
					}

					replacements.push(makeImports(t, names, src));
				}

				replacements.push(importDeclaration);
				path.replaceWithMultiple(replacements);
			}
		}
	}
}

function makeImport(t, name, path) {
	return t.importDeclaration([
		t.importDefaultSpecifier(t.identifier(name))
	], t.stringLiteral(path))
}

function makeImports(t, names, path) {
	let identifiers = [];

	for (const name of names) {
		identifiers.push(t.importSpecifier(t.identifier(name), t.identifier(name)));
	}
	return t.importDeclaration(identifiers, t.stringLiteral(path));
}