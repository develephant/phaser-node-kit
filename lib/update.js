/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */

//Updates PhaserCE to latest

const {pp} = require('./utils')
const fs = require('fs-extra')
const spawn = require('child_process').spawn
const path = require('path')
const paths = require('./paths')

class Update {
  constructor() { }

  run() {
    pp.info('Updating PhaserJS...')
    const npm = spawn('npm', ['install', 'phaser-ce@latest'], { cwd: paths.cli.base, stdio: ['pipe', 'ignore', 'ignore']})

    npm.on('close', (e) => {
      if (e === 0) {
        fs.copySync(path.join(paths.cli.phaser, 'phaser.min.js'), path.join(paths.game_vendor, 'phaser.min.js'))
        pp.ok('PhaserJS Updated!')
      } else if (e === 243) {
        pp.err('Please use "sudo pnkit update"')
      } else {
        pp.err(`An error occurred during the update: code ${e}`)
      }
    })
  }
 }

module.exports = Update
