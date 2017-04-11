
# Workflow

So here comes the "fairly opinionated" part.

While there is nothing different about the coding in general, there are some design choices made on where files reside and how they are incorporated into the workflow that you need to be aware of.

But before we go there, some context...

## Some Context

I've been playing with games for nearly two and a half decades. I was an ActionScript developer from version 1 through 3, and have spent the last five working with the Lua game development community, mostly building server based tools. I heart making games, teaching, and developing tools and workflows to help people make games with less fuss. Having discovered __Phaser__ and brushing up with __Node__, I've found my ideal tool set. Having used this kit for a while now, I thought others might enjoy using it as well.

Okay, enough context. ^_^

## The Big Picture

I like to get up and running quick when an idea hits me. I prototype constantly (or just noodle around) and don't like to spend time on tooling. Set it and forget works great for me.

The goal for __Phaser Node Kit__ was to be able to get to the _creative_ phase as quick as possible. 

So with a `pnkit init`

And a `npm run watch`

I'm looking at a "live" build in my browser ready to hack on, with a _build_ folder ready to serve or bundle with something like [Cordova](https://cordova.apache.org/).

I enjoy a certain amount of abstraction in code -- though sometimes a one-pager will do just fine. With _Phaser Node Kit_ there is a level of abstraction in regards to _Phaser_ states, which will be explained more below. Beyond that its pretty much business as usual for both _Phaser_ and _Node_, assuming you keep a few things in mind.

## Indexes

The different index files have some basic data for their particular domain.

### index.css

The included css file (_game/css/index.css_) contains the page wide background color, as well as an implementation of _clean.css_ which provides better visual compatibility across browsers.

### index.html

The html entry point (_game/index.html_) contains some standard scaffolding, as well as _apple-mobile-web_ meta tags.

### index.js

The javascript entry point (_game/index.js_) contains the _state_ assignments and a device render mode check:

```js
// PHASER IS IMPORTED AS AN EXTERNAL BUNDLE IN INDEX.HTML
const runPhaser = function(renderMode) {

  renderMode = Phaser.CANVAS

  /* States */
  const bootState     = require('./states/BootState')
  const preloadState  = require('./states/PreloadState')
  const menuState     = require('./states/MenuState')
  const gameState     = require('./states/GameState')

  const game = new Phaser.Game(800, 600, renderMode, 'game')

  //add states
  game.state.add('Boot',       bootState)
  game.state.add('Preloader',  preloadState)
  game.state.add('MainMenu',   menuState)
  game.state.add('Game',       gameState)

  //start the `boot` state
  game.state.start('Boot')

}

Phaser.Device.whenReady(() => {
  let renderMode = Phaser.CANVAS

  if (Phaser.Device.desktop) {
    renderMode = Phaser.WEBGL
  } else if (Phaser.Device.android) {
    if (Phaser.Device.isAndroidStockBrowser()) {
      renderMode = Phaser.WEBGL
    } else {
      renderMode = Phaser.CANVAS
    }

  } else if (Phaser.Device.iOS) {
    renderMode = Phaser.WEBGL
  }

  runPhaser(renderMode)
})
```

## States

### Phaser Node Kit States

_Phaser_ has an excellent state system to manange different game scenes; like the main menu, game play, IAP, etc. I tend to put as little as possible in the state files. Usually just boilerplate and configuration based code. _Phaser Node Kit_ keeps all the state files in a `state` directory inside of the main `js` folder.

There are four state files included, which run in the following order:

 - _BootState.js_

 - _PreloadState.js_

 - _MenuState.js_

 - _GameState.js_

Lets look inside...

> While I'm sure its obvious, from here on out we'll be using Node and es2015.

#### BootState.js

The _BootState_ is the first state that is run once _Phaser_ is ready for it. It contains mostly configuration code, and preloads the "loading" bar into the image cache, which is used in the next state.

```js
class BootState {

  preload() {
    this.stage.backgroundColor = 0x000000

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.scale.setMinMax(300, 400)

    this.scale.pageAlignVertically = true
    this.scale.pageAlignHorizontally = true

    if (Phaser.Device.desktop === false) {
      this.scale.forceOrientation(false, true)
    }

    this.load.image('preload', 'img/preload.png')
  }

  create() {
    this.input.maxPointers = 1
    this.state.start('Preloader')
  }

  update() { }
  render() { }
}

module.exports = BootState
```

In particular, the _BootState_ contains:

 - Background color
 - Scale mode
 - Fullscreen mode
 - Scale min/max
 - Container alignment
 - Orientation setting
 - maxPointers setting

If you like your backgrounds black, and develop in an 800x600 display size, you never have to touch this file. ^_^

Once the _BootState_ is done, it automatically load the next state, which is the... 

#### PreloadState.js

In the _PreloadState_ we load all of the assets needed for the game. While this is happening the "loading" bar will display the progress (I love free progress bars).

```js
class PreloadState {

  preload() {
    this.preloadBar = null
 
    this.preloadBar = this.game.add.sprite(
      this.game.world.centerX, 
      this.game.world.centerY, 
      'preload')
    
    this.preloadBar.anchor.set(.5)

    this.load.setPreloadSprite(this.preloadBar)

    this.load.image('logo', 'img/logo.png')
    this.load.image('node', 'img/node.png')
  }

  create() {
    this.state.start('MainMenu')
  }

  update() { }
  render() { }
}

module.exports = PreloadState
```

As far as states are concerned, you may visit this one most often to add additional assets to your game.

Once the _PreloadState_ has run its course, it will load the _MenuState_.

#### MenuState.js

Main menus are generally not very complex. A background and a couple buttons is usually the bulk of it. The _MenuState_ here is very minimal. We are simply displaying the _Phaser_ logo, and the waiting for the `onTap` signal from the input manager.

```js
class MenuState {
  preload() { }

  create() {
    //bg
    let logo = this.game.add.image(
      this.game.world.centerX, 
      this.game.world.centerY, 
      'logo')
    
    logo.anchor.set(.5)

    this.input.onTap.addOnce((pointer) => {
      this.state.start('Game')
    })
  }

  update() { }
  render() { }
}

module.exports = MenuState
```

Do what you will to it, but make sure to point to the _GameState_ as your final destination (at least in this case).

Let the game begin!

#### GameState.js

Ahh, finally. Now we play. The _GameState_ is just what it sounds like. Here is where your game takes flight. 

You may be suprised to see this:

```js
class GameState {
  preload() { 
    console.log('game state started') 
  }

  create() { 
    let node = this.game.add.image(
      this.game.world.centerX, 
      this.game.world.centerY, 
      'node')

    node.anchor.set(.5)
  }

  update() { }
  render() { }
}

module.exports = GameState
```

Not much of a game. But believe it or not, the _GameState_ will be your _leanest_ state.

Here we are simply displaying the _Node_ logo for something to do. Its also where we jump off the state train, and move into our development domain.

## Making An Engine

A moment ago I mentioned that the _GameState_ would be your _leanest_ state. This is done by building some modules in the root `js` directory and adding them to the _GameState.js_. This approach makes it really simple to change out your _engine_ code modules with other alternatives for testing ideas, etc.

Lets look at how this works in practice. First we need to create an ___engine.js___ file in the root _js_ directory to put our game "controller" code in. This _engine.js_ will be used to orchastrate the systems in your game. This makes it much easier to manage your game overall. A single point of entry and exit.

First a simple _engine.js_:

```js
class Engine {
  constructor(game) {
    this.game = game
  }

  run() {
    console.log('engine started')
  }
}

module.exports = Engine
```

We are simply taking in the `game` reference and storing for use within the class.

> An important distinction to make here is that the `game` is an entry point to the Phaser library. In a state file, the `game` is inferred. This can cause mistakes when jumping into different coding contexts.

As an example, in the engine file we'd use the following to access the input manager:

```js
this.game.input
```

In a state file (and only a state file) it can also be written like so:
```js
this.input //wont work in engine.js
```

When looking at other code examples on the web, be sure to double check this if your results are unexpected.

Moving on, it's time to wire up the _engine.js_ to the _GameState.js_:

__GameState.js__

```js
const Engine = require('../engine')

class GameState {
  preload() { }

  create() {
    let engine = new Engine(this).run()
  }
  
  update() { }
  render() { }
}

module.exports = GameState

```

Your needs may vary, but I most often include my _ui.js_ here as well and pass it to the _engine.js_, ending up with something like:

```js
const Ui = require('../ui')
const Engine = require('../engine)

class GameState() {
  create() {
    let ui = new Ui(this)
    let engine = new Engine(this, ui)
  }
}

module.exports = GameState
```

And fire it all up in the _engine.js_:

```js
class Engine() {
  constructor(game, ui) {
    this.game = game
    this.ui = ui

    this.ui.run() //assuming a run method
    this.run()
  }

  run() {
    console.log('engine started')
  }
}

module.exports = Engine
```

The following code demonstrates _the_ common pattern when making any additional classes:

```js
class SomeClass {
  constructor(game) {
    this.game = game
  }
}

module.exports = SomeClass
```

## Extending Classes

Again, we are working in the root `js` folder now (and forever). As an example of extending a _Phaser_ class, lets look at a Sprite:

```js
class MySprite extends Phaser.Sprite {
  constructor(game, x, y, img) {
    super(game, x, y, img)

    //look ma, I'm a Sprite!
    this.alpha = .5
  }
}

module.exports = MySprite

```

_Usage:_

```js
const MySprite = require('./mySprite.js')

class SomeClass {
  constructor(game) {
    this.game = game

    this.sprite = new MySprite(this.game, 0, 0, 'logo')
    this.sprite.anchor.set(.5)
  }
}

module.exports = SomeClass

```

Now, if you were to run the _SomeClass_ nothing would be displayed on the screen. We must add the Sprite to the display list. This can be done in a couple of different ways, and happens on its own in some cases, such as adding the Sprite to a visible and active group.

The most direct way to add this Sprite to the display list is like so:

```js
//SomeClass constructor
constructor(game) {
  this.game = game
  let sprite = new MySprite(this.game, 0, 0, 'logo')

  this.game.world.add(sprite)
}
```

> In most use cases, the sprite above should be put in a predfined group, rather than directly in the world.

If you have a group already on the display list, adding the Sprite will make it come alive:

```js
//SomeClass constructor
constructor(game, grp) {
  this.game = game
  this.grp = grp //on display list

  let sprite = new MySprite(this.game, 0, 0, 'logo')
  this.grp.add(sprite) //sprite becomes visible
}
```