/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const {p} = require('./utils')
const fs = require('fs-extra')
const paths = require('./paths')

const Build = require('./build')

class Clean {
  constructor() { }

  run() {
    p.log('Cleaning...')

    //clean build
    fs.emptyDirSync(paths.build)

    //rebuild
    let builder = new Build()
    builder.run(false)
  }
}

module.exports = Clean
