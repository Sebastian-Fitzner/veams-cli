# DEPRECATED :: Use [`@veams/cli`](https://github.com/Veams/cli)

<br>
<br>
<a href="http://badge.fury.io/js/veams-cli"><img src="https://badge.fury.io/js/veams-cli.svg" alt="NPM version" /></a>
<a href="https://gitter.im/Sebastian-Fitzner/Veams?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge"><img src="https://badges.gitter.im/Sebastian-Fitzner/Veams.svg" alt="Gitter Chat" /></a>
</p>

<p align="center">
	<strong>The command line interface for Veams.</strong>
	<br>
	<a href="http://veams.org">Visit the Veams website.</a><br>
</p>

## Documentation

Veams-cli gives you the possibility to 
- install Veams-JS
- install Veams-Components (all or single components)
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

|Command     | Shortcut | Description |
|------------|----------|-------------------------------------------------------|
|add     | -a | Add a component or block to your project (@see Command: add) |
|help    | -h | Show the help. |
|install | -i | Install extensions (@see Command: install). |
|new     | -n | Create something new (@see Command: new) |
|update  | -u | Update veams-cli and all packages |
|version | -v | Show VEAMS version |

### Command: new

|Arguments | Shortcut | Description                            | Example |
|----------|----------|----------------------------------------|---------|
|blueprint [name] | bp | Create a new blueprint from scratch.   | `veams new blueprint accordion` |
|project  | p | Create a new project from scratch.     | `veams new project` |

### Command: add

|Arguments | Shortcut | Description                            | Example |
|----------|----------|----------------------------------------|---------|
|block [name] | b | Add a block to your project  | `veams add block navigation` |
|component [name] | c | Add a component to your project   | `veams add component slider` |
|custom [name] [folder]  | cu | Add a custom type to your project | `veams add custom myFolder` |
|utility [name] | u | Add an utility to your project   | `veams add utility grid-col` |

### Command: install

|Arguments              | Shortcut | Description                         | Example |
|-----------------------|----------|-------------------------------------|--------|
|blueprint [path] [type]| bp | Install a blueprint based on Veams.  | `veams install blueprint C:\blueprint\slider component` |
|bower-component [registryName] [name] [type] | bc | Install a bower-component based on Veams. | `veams install bower-component custom-slider slider component (--S)` |
|grunt-module       | gm | Install a specific grunt module.    | `veams install grunt-module` |
|veams-block [name] | vb | Install a specific veams-block. | `veams install veams-block overlay (--S)` |
|veams-component [name] | vc | Install a specific veams-component. | `veams install veams-component slider (--S)` |
|veams-utility [name] | vu | Install a specific veams-utility. | `veams install veams-utility grid (--S)` |
