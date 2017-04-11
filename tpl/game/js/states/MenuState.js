
/* Menu State */
class MenuState {
  preload() { }

  create() {
    //bg
    let logo = this.game.add.image(
      this.game.world.centerX, 
      this.game.world.centerY, 
      'logo')
    
    logo.anchor.set(.5)

    this.input.onTap.addOnce((pointer) => {
      this.state.start('Game')
    })
  }

  update() { }
  render() { }
}

module.exports = MenuState