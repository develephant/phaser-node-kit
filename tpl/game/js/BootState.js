
class BootState {

  preload() {
    this.stage.backgroundColor = 0x000000

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.scale.setMinMax(800, 600)

    this.scale.pageAlignVertically = true
    this.scale.pageAlignHorizontally = true

    this.load.image('preload', 'img/preload.png')
  }

  create() {
    this.input.maxPointers = 1

    this.state.start('Preload')
  }

  update() { }
  render() { }
}

module.exports = BootState
