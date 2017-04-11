/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const path = require('path')
const fs = require('fs-extra')
const {p} = require('./utils')
const paths = require('./paths')
const bundler = require('./bundler')
const pnconfig = require(paths.cli.config)

class Build {

  run() {
    p.title()

    p.log('Generating New Build...')

    fs.ensureDirSync(paths.build)

    //copy game to build 
    let copydirs = pnconfig.copy

    let fromDir
    Object.keys(copydirs).map((val) => {
      fromDir = copydirs[val]
      fs.ensureDirSync(path.join(paths.game, fromDir))
      fs.copySync(path.join(paths.game, fromDir), path.join(paths.build, fromDir))
    })

    //copy includes
    let pnkit = require(path.join(paths.base, 'pnkit.json'))

    let src
    pnkit.game.map((val) => {
      try {
        src = path.join(paths.game, val) 
        fs.copySync(src, path.join(paths.build, val))
      } catch(err) {
        if (err) {
          p.err(`Could not locate ${src}`)
        }
      }
    })

    pnkit.external.map((val) => {
      try {
        src = path.join(paths.base, val)
        fs.copySync(src, path.join(paths.build, val))
      } catch(err) {
        if (err) { p.err(`Could not locate ${src}`) }
      }
    })

    //index and favicon
    fs.copySync(path.join(paths.game, 'index.html'), path.join(paths.build, 'index.html'))
    fs.copySync(path.join(paths.game, 'favicon.ico'), path.join(paths.build, 'favicon.ico'))

    fs.copy(path.join(paths.game, 'vendor', 'phaser.js'), path.join(paths.build, 'vendor', 'phaser.js'), (err) => {
      if (err) {
        console.error(err)
      } else {
        let d = new Date()
        bundler.bundle().then(() => { p.ok(`Build Has Completed @${d.toLocaleTimeString()}`) })
      }
    })

  }
}

module.exports = Build
