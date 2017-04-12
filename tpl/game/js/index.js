// PHASER IS IMPORTED AS AN EXTERNAL BUNDLE IN INDEX.HTML
const runPhaser = function(renderMode) {

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
