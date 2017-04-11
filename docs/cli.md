
# Commands

__Phaser Node Kit__ only has a couple commands to get you up and running.

## Init

__`pnkit init`__

__To create a new Phaser Node Kit project do the following:__

 - Create a new empty directory.

 - Create a _package.json_ file (optional).

 - Run `pnkit init` on the command line in the directory you created.

 
_package.json_

You can create your own _package.json_ before running `pnkit init` or a bare one will be created for you.

___In either case the package.json file will be injected with some configuration settings. This file needs to stay with your project after initalization.___

## Build

When you are ready to compile your files to your _build_ directory, you run:

`pnkit build`

The should be done on the command line in the root project directory. The game "distribution" files will be contained in the _build_ directory.

All files are flushed in the _build_ directory on each build, so if you'd like a "snapshot" via git or other means, now is the time to do it.

_See below for the "watch" build option._

## Watch

If you would like to watch the game development files, and trigger a build on changes, you use a slightly different command. This one references _npm_:

`npm run watch`

Phaser Node Kit will now run a build when any of the files are updated. Additonally you can view the current game state in your local browser. By default the url is __http://localhost:5550__.

You can leave the browser window running, and it will refresh with each build.

_For other "watch" options see [Additional Notes](notes.md)._

_To make adjustments to the watch server, see [Configuration](config.md)._

## Clean

There may be times when you want to clean the _build_ directory between builds. You can do this using:

`pnkit clean`

This will flush the _build_ folder and rebuild the project at its current state.

A `clean` is run before each build takes place, so this command only has real usage in "non-watched" development.
