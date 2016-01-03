<p align="center"><img src="http://www.veams.org/img/svg/icons/veams-std.svg"></p>

<p align="center">
	<strong>The command line interface for Veams.</strong>
	<br><br>
	<a href="http://veams.org">Visit the Veams website.</a><br><br>
</p>

## Documentation

Veams-cli gaves you the possibility to 
- install Veams-Generator
- install Veams-JS
- install Veams-Components (all or single components)
- install Veams-Sass
- install custom components (based on Veams-Component blueprints)
- scaffold a new project
- scaffold a new component from scratch
- start sub generators

## Installation

Install `veams-cli` via: `npm install -g veams-cli`.

## Usage 

Here you can find help instructions how you can use veams-cli:

|Command | Description |
|--------|-----------------------------------------------------------|
|help    | Show the help. |
|install | Install extensions (@see Command: install). |
|new     | Create something new (@see Command: new) |
|update  | Update veams-cli and all packages |

### Command: new

|Arguments | Description                            | Example |
|----------|----------------------------------------|---------|
|component | Create a new component from scratch.   | `veams new component` |
|project   | Create a new project.                  | `veams new project` |

### Command: install

|Arguments              | Description                         | Example |
|-----------------------|-------------------------------------|--------|
|grunt-module            | Install a specific grunt module.    | `veams install grunt-module` |
|template-helper         | Install custom template helpers.    | `veams install template-helper` |
|veams-components       | Install all veams-components.       | `veams install veams-components (--S)` |
|veams-component [name] | Install a specific veams-component. | `veams install veams-component slider (--S)` |
|veams-js               | Install veams-js.                   | `veams install veams-js (--S)` |
