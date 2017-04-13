
class Engine {
  
  constructor(game) {
    this.game = game
  }

  run() {
    let pnlogo = this.game.add.image(
      this.game.world.centerX, 
      this.game.world.centerY, 
      'pnlogo')

    pnlogo.anchor.set(.5)
  }

  update() { }
  render() { }
}

module.exports = Engine
