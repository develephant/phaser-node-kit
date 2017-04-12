
class Engine {
  constructor(game) {
    this.game = game
  }

  run() {
    let node = this.game.add.image(
      this.game.world.centerX, 
      this.game.world.centerY, 
      'pnlogo')

    node.anchor.set(.5)
  }

  update() { }
  render() { }
}

module.exports = Engine
