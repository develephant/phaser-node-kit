
# Configuration

__Phaser Node Kit__ is a fairly opinionated framework, so configuration options are minimal. You can however add some different resource paths, and adjust the watch server settings.

## pnkit.json

All of the Phaser Node Kit project settings can be found in the ___pnkit.json___ file at the root of the project directory. This file is critical to the tools operation. Don't lose it. ^_^

The default configuration file looks like so:

```json
{
  "build": {
    "game": [
      "data",
      "font"
    ],
    "external": []
  },
  "port": 5550,
  "interval": 750,
  "serve": "build",
  "watchexps": [
    "game/** # npm run build"
  ],
  "quiet": true
}
```

## Configuration Keys

What follows is a detailed explanation of the _pnkit.json_ keys.

### build

The build section contains two keys holding arrays named `game` and `external`, which can be used to adjust your source directories.

#### game

By default the game template created with Phaser Node Kit is minimal. To add additional directories to your build, do the following:

  - Create the new directory in your _game_ folder.

  - Add an entry to the `game` key array.

_In the default config above, the directories __data__ and __font__ are added to the project as additional entries. If you don't need that functionality, you can remove the directories, as well as the entries in the __pnkit.json__ file._ 

#### external

If you would like to include directories in the build from outside of the _game_ directory, you can add them to this array. The steps are the same as for the `game` key above. 

### port

The port the watch server will use. The default port is 5550.

### interval

The time in milliseconds between watch updates. The default is 750.

### serve

The directory that will be served up. The default is the _build_ directory.

### watchexps

The server watch expressions. 

The default is to watch the _game_ directory and run a "clean-n-build" on changes.

_In the config above, the pound sign (#) is not a comment, but a separator. Do not remove it. For more info see the __light-server__ entry below._

### quiet

Keep the noise down on the watch server output. The default is `true`.

---

## light-server

Phaser Node Kit uses the crafty __light-server__ package to serve up your game in progress. You can learn more about its usage options at [https://www.npmjs.com/package/light-server](https://www.npmjs.com/package/light-server).