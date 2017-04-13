
const Engine = require('../Engine')

class GameState {

  preload() { }

  create() {
    this.engine = new Engine(this.game)
    this.engine.run()
  }
  
  update() { this.engine.update() }
  render() { this.engine.render() }
}

module.exports = GameState
