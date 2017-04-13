// PHASER IS IMPORTED AS AN EXTERNAL BUNDLE IN INDEX.HTML

const runPhaser = function(renderMode) {

  const bootState     = require('./states/BootState')
  const preloadState  = require('./states/PreloadState')
  const menuState     = require('./states/MenuState')
  const gameState     = require('./states/GameState')

  const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')

  game.state.add('Boot',      bootState)
  game.state.add('Preload',   preloadState)
  game.state.add('MainMenu',  menuState)
  game.state.add('Game',      gameState)

  game.state.start('Boot')
}
