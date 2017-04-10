# `phaser-node-kit`

### Phaser Node Kit - Game Development Using Phaser and Node

## Install

```
npm i -g phaser-node-kit
```

## Usage

```js
pnkit [init|clean|build]
```

## Getting Started

It takes only 3 steps to get up and running developing games using NodeJS and PhaserJS.

_Install phaser-node-kit globally (it's a command line utility)_

`sudo i -g phaser-node-kit`

_Run the initialization in a folder of your choice_

`pnkit init`

_Start the watch server_

`npm run watch`

> The default port for viewing your game is 5550. This can be changed in the _pnkit.json_ file.

## Workflow

As long as the _watcher_ is running, simply develop your game in the _game_ directory. As you make changes to code, the watcher will trigger a build.
As you make changes to other files, they will be copied to the _build_ directory (and the build will run).

## Coding

Your __Node__ based javascript is compiled into a _Browserify_ bundle (via _Babel_) on each build. The builder is configured for _ES6_ support.

You can use __Node__ as you would usually for the most part (see Browserify for limitations). The game "distrbution" files are rendered in the _build_ folder.

> Don't edit files in the _build_ directory, they are overwritten often. All work is done in the _game_ folder. 

## CLI

The __phaser-node-kit__ is a CLI application that scaffolds a basic game project, specfically for __Node__ based coding. There are a handful of commands available:

### init

`pnkit init`

Scaffold a new __phaser-node-kit__ project in an empty directory. You can create a _package.json_ file before running `init` or a minimal one will be generated for you. In either case, the _package.json_ file will be injected with a few commands. Don't delete this file.

### build

`pnkit build`

Regenerate the project files in the _build_ directory. This command does __not__ clean the directory before the build takes place (see `clean`). The `build` command is run by the watcher when it is active.

### clean

`pnkit clean`

Clean the _build_ directory and then run the `build` command.

## Configuration

In the root directory of the project is a __pnkit.json__ file which contains configuration settings. In almost all cases, this file should __not__ be removed. This file should live with your project, but is not needed for the distribution of your game.

## Other Commands

The following commands are also available, but are generally used internally by the "kit" scripts. These commands should only be used if you know what you're after.

### watch

`pnkit watch`

If you have your own preference for serving up your files, you can use this _watch_ command instead of the `npm run watch` command. 

The `pnkit watch` command will monitor changes in the _game_ directory and push (and recompile) changes to the _build_ directory. Point your _serve_ script at the _build_ directory.

### bundle

`pnkit bundle`

Creates the build _bundle.js_. This command does not do any other work. The `bundle.js` file contains all of your javascript code, not including the _phaser.js_ module. The final output is run through _Babel_ and _Browserify_.

### phaserify

`pnkit phaserify`

Not currently used for `phaser-node-kit`, but will generate a "Browserified" bundle of the core _phaser.js_ library. The output file can be found in the `build/vendor` directory as _phaser-bundle.js_. 

If you run a `clean` command the bundle will be replaced with the default. Make sure to pull this bundle if you would like to use it elsewhere. 

If you want to use the bundle in your current project, you must edit your _game/index.html_ and replace the default _phaser.js_ with _phaser-bundle.js_. Make sure to place the file in the _vendor_ directory. 

Generally, this command is not needed except in unique situations.

---

#### `phaser-node-kit` &Star; &copy; 2017 develephant &Star; MIT license
