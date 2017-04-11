# Phaser Node Kit

___Game development using PhaserJS and NodeJS___

## What Is It?

__Phaser Node Kit__ is a fairly opinionated workflow and build tool for creating __[PhaserJS](http://phaser.io)__ games using __[NodeJS](http://nodejs.org)__.

You may be asking yourself, why? And that I can't answer clearly. I just prefer the __NodeJS__ stylings and spend most of my time in the __NodeJS__ environment.

The build tool just a collection of some popular libraries to get your game built for distribution.

The major components consist of:

__NodeJS__

__Babel (es2015)__

__Browserify__

_and of course..._

__PhaserJS__

## How It Works

On each build cycle your javascript code is compiled to a _Browserify_ bundle ready to play. The _phaser.js_ file is gathered from _npm_ and added as a vendor file during the initial creation of your project. See [Additional Notes](notes.md) for more information about the handling of the _phaser.js_ library.

Phaser Node Kit imposes a certain workflow, but provides a few entry points to handle unique situations. For straight forward game development the workflow should prove accommodating. See the [Workflow](workflow.md) section for more details.