
class GameState {

  preload() { }

  create() {
    let pnlogo = this.add.image(
      this.world.centerX, 
      this.world.centerY, 
      'pnlogo')

    pnlogo.anchor.set(.5)
  }
  
  update() { }
  render() { }
}

module.exports = GameState
