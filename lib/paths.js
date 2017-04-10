/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const path = require('path')

const clibase = path.resolve(__dirname, '..')
const libbase = path.join(clibase, 'lib')
const appbase = process.cwd()

module.exports = {
  base: appbase,
  game: path.join(appbase, 'game'),
  build: path.join(appbase, 'build'),
  config: path.join(appbase, 'pnkit.json'),
  dist: path.join(appbase, 'dist'),
  build_vendor: path.join(appbase, 'build', 'vendor'),
  cli: {
    base: clibase,
    config: path.join(clibase, 'pnkit.json'),
    game: path.join(clibase, 'tpl', 'game'),
    phaser: path.join(clibase, 'node_modules', 'phaser-ce')
  }

}