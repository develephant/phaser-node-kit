/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const {p} = require('./utils')
const bundler = require('./bundler')
const fs = require('fs-extra')
const get = require('simple-get')
const path = require('path')
const paths = require('./paths')

const pnconfig = require(paths.cli.config)


class Build {

  refresh() {
    //refresh browser
    get('http://127.0.0.1:5550/__lightserver__/trigger', (err, resp) => {
      if (err) {
        console.error(err)
      }
    })
  }

  run(refresh=true) {

    p.log('Generating Build')

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
    pnkit.build.game.map((val) => {
      try {
        src = path.join(paths.game, val) 
        fs.copySync(src, path.join(paths.build, val))
      } catch(err) {
        if (err) {
          p.err(`Could not locate ${src}`)
        }
      }
    })

    pnkit.build.external.map((val) => {
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
        bundler.bundle().then(() => {
          if (refresh === true) {
            this.refresh()
          }
          p.ok(`Build Completed @${d.toLocaleTimeString()}`) 
        })
      }
    })

  }
}

module.exports = Build
