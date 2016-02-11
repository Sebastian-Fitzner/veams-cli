<p align="center"><img src="http://www.veams.org/img/svg/icons/veams-std.svg"></p>

<p align="center">
	<strong>The command line interface for Veams.</strong>
	<br><br>
	<a href="http://veams.org">Visit the Veams website.</a><br><br>
</p>

## Documentation

Veams-cli gives you the possibility to 
- install Veams-JS
- install Veams-Components (all or single components)
- install Veams-Sass
- install custom components (based on Veams-Component blueprints)
- install template helpers
- install grunt modules
- scaffold a new project
- scaffold a new component from scratch

## Installation

Install `veams-cli` via: `npm install -g veams-cli`.

## Usage 

Here you can find help instructions how you can use veams-cli:

`veams command [arguments]`

|Command     | Description |
|------------|-------------------------------------------------------|
|help, -h    | Show the help. |
|install, -i | Install extensions (@see Command: install). |
|new, -n     | Create something new (@see Command: new) |
|add, -a     | Add a component or block to your project (@see Command: add) |
|update, -u  | Update veams-cli and all packages |
|version, -v | Show VEAMS version |

### Command: new

|Arguments | Description                            | Example |
|----------|----------------------------------------|---------|
|blueprint | Create a new blueprint from scratch.   | `veams new blueprint` |
|project   | Create a new project from scratch.     | `veams new project` |

### Command: add

|Arguments | Description                            | Example |
|----------|----------------------------------------|---------|
|component [name] | Add a component to your project   | `veams add component slider` |
|block [name]   | Add a block to your project.  | `veams add block navigation` |

### Command: install

|Arguments              | Description                         | Example |
|-----------------------|-------------------------------------|--------|
|blueprint [path] [type]| Install a blueprint based on Veams.  | `veams install blueprint C:\blueprint\slider component` |
|grunt-module            | Install a specific grunt module.    | `veams install grunt-module` |
|template-helper         | Install custom template helpers.    | `veams install template-helper` |
|veams-components       | Install all veams-components.       | `veams install veams-components (--S)` |
|veams-component [name] | Install a specific veams-component. | `veams install veams-component slider (--S)` |
|veams-js               | Install veams-js.                   | `veams install veams-js (--S)` |
