
/* Boot State */
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
