
class MenuState {

  preload() { }

  create() {
    let logo = this.add.image(
      this.world.centerX, 
      this.world.centerY, 
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
