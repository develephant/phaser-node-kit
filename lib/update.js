/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */

//Updates PhaserCE to latest

const {pp} = require('./utils')
const spawn = require('child_process').spawn
const paths = require('./paths')

class Update {
  constructor() { }

  run() {
    pp.info('Updating PhaserJS Library...')
    const npm = spawn('npm', ['install', 'phaser-ce@latest'], { cwd: paths.cli.base})
  }
 }

module.exports = Update
