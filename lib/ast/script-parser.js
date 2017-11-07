const babel = require('babel-core');
const prettier = require('prettier');

// use custom plugin to transform the source
module.exports = (file, options) => {
	return new Promise((resolve, reject) => {
		let code = babel.transform(file, {
			plugins: [
				[
					importer, options
				]
			]
		}).code;

		resolve(code);

		reject('Error :: Parsing of script goes wrong.');
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
				const importDeclaration = makeImport(t, {name: state.opts.clName}, state.opts.path);
				const replacements = [];

				if (specifiers.length > 0) {
					const names = [];

					for (const specifier of specifiers) {
						names.push({
							name: specifier.local.name,
							type: specifier.type
						});
					}


					if (names.length > 1 || names[0].type === 'ImportSpecifier') {
						replacements.push(makeImports(t, names, src));
					} else {
						replacements.push(makeImport(t, names[0], src));
					}
				}

				replacements.push(importDeclaration);
				path.replaceWithMultiple(replacements);
			}
		}
	}
}

function makeImport(t, name, path) {
	return t.importDeclaration([
		t.importDefaultSpecifier(t.identifier(name.name))
	], t.stringLiteral(path))
}

function makeImports(t, names, path) {
	let identifiers = [];

	for (const name of names) {
		identifiers.push(t.importSpecifier(t.identifier(name.name), t.identifier(name.name)));
	}
	return t.importDeclaration(identifiers, t.stringLiteral(path));
}