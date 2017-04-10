
/* Game State */
class GameState {
  preload() { console.log('game state started') }

  create() { 
    let node = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'node')
    node.anchor.set(.5)
  }

  update() { }
  
  render() { }
}

module.exports = GameState
