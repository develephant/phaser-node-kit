/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const {p} = require('./utils')
const fs = require('fs-extra')
const get = require('simple-get')
const path = require('path')
const paths = require('./paths')

const Bundle = require('./bundle')

class Build {
  constructor() { 
    this.bundler = new Bundle()
    this.pnconfig = require(paths.cli.config)
  }

  refresh() {
    console.log('build refresh')
    console.log(this.pnconfig.watch.host, this.pnconfig.watch.port)
    get(`http://${this.pnconfig.watch.host}:${this.pnconfig.watch.port}/__lightserver__/trigger`, (err, resp) => {
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
    let pnkit = require(paths.config)

    let src
    pnkit.dirs.game.map((val) => {
      try {
        src = path.join(paths.game, val) 
        fs.copySync(src, path.join(pnkit.watch.dir, val))
      } catch(err) {
        if (err) {
          p.err(`Could not locate ${src}`)
        }
      }
    })

    pnkit.dirs.external.map((val) => {
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
        this.bundler.run().then(() => {
          if (refresh === true) {
            this.refresh()
          }
          let d = new Date()
          p.ok(`Build Completed @${d.toLocaleTimeString()}`) 
        })
        .catch((err) => {
          p.err(err)
        })
      }
    })
  }
}

module.exports = Build
