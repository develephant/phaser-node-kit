# `phaser-node-kit`

### Phaser Node Kit - Game Development Using NodeJS and PhaserJS

## Install

```
npm i -g phaser-node-kit
```

## Usage

```js
pnkit [init|build|clean]
```

## Getting Started

It takes only 3 steps to get up and running developing games using NodeJS and PhaserJS.

_Install phaser-node-kit globally (it's a command line utility)_

`sudo i -g phaser-node-kit`

_Run the initialization in a folder of your choice_

`pnkit init`

_Start the watch server_

`npm run watch`


## Workflow

As long as the watcher is running, simply develop your game in the `game` directory. As you make changes to code, the watcher will trigger a build. 

As you make changes to other files, they will be copied to the `build` directory.

## Coding

You Node based javascript is compiled into a Browserify bundle (via Babel) on each build. The builder is configured for ES6 support.

You can use Node as you would usually for the most part (see Browserify for limitations). The game "distrbution" files are rendered in the `build` folder.

> Don't edit files in the `build` directory, they are overwritten often. All work is done in the `game` folder. 

## CLI

The phaser-node-kit is a CLI application that scaffolds a basic game project, specfically for Node based coding. There are a handful of commands available:

### `init`

`pnkit init`

Scaffold a new phaser-node-kit project in an empty directory. You can create a `package.json` file before running `init` or a minimal one will be generated for you. In either case, the `package.json` file will be injected with a few commands. Don't delete this file.

### `build`

`pnkit build`

Regenerate the project files in the `build` directory. This command does __not__ clean the `build` directory before the build takes place (see `clean`). The `build` command is run by the watcher when it is active.

### `clean`

`pnkit clean`

Clean the `build` directory and then run the `build` command.

## Config

In the root directory of the project is a _pnkit.json_ file which contains configuration settings. In almost all cases, this file should __not__ be removed. This file should live with your project, but is not needed for the distribution of your game.

## Other Commands

The following commands are available, but are generally used internally by the "kit" scripts. These commands should only be used if you know what you're after.

### `watch`

`pnkit watch`

If you have your own preference for serving up your files, you can use this _watch_ command instead of the `npm run watch` command. The `pnkit watch` command will monitor changes in the `game` directory and push (and recompile) changes to the `build` directory. Point you _serve_ script at the `build` directory.

### `bundle`

`pnkit bundle`

Creates the build _bundle.js_. This command does not do any other work. The `bundle.js` file contains all of your javascript code, not including the `phaser.js` module. The final output is run through _Babel_ and _Browserify_.

### `phaserify`

`pnkit phaserify`

Not currently used for `phaser-node-kit`, but will generate a "Browserified" bundle of the core _Phaser.js_ library. The output file can be found in the `build/vendor` directory as `phaser-bundle.js`. If you run a `clean` command the bundle will be replaced with the default. Make sure to pull this bundle if you would like to use it elsewhere. If you want to use the bundle in your current project, you must edit your `game/index.html` and replace the default `phaser.js` with `phaser-bundle.js`. Generally, this is not needed except in unique situations.

---

#### `phaser-node-kit` &Star; &copy; 2017 develephant &Star; MIT license
