
/* Preload State */
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
    this.load.image('pnlogo', 'img/pnlogo.png')
  }

  create() {
    this.state.start('MainMenu')
  }

  update() { }
  render() { }
}

module.exports = PreloadState