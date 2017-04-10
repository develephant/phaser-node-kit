
const path = require('path')
const fs = require('fs-extra')

const {p} = require('./utils')
const paths = require('./paths')
const bundler = require('./bundler')

const pnconfig = require(paths.cli.config)

class Build {

  run() {
    p.title()

    // p.log('Cleaning Build Directory...')
    // cleaner.run()

    p.log('Generating New Build...')

    fs.ensureDirSync(paths.build)

    //copy game to build 
    let copydirs = pnconfig.copy

    let fromDir
    Object.keys(copydirs).map((val) => {
      fromDir = copydirs[val]
      fs.copySync(path.join(paths.game, fromDir), path.join(paths.build, fromDir))
    })

    //index and favicon
    fs.copySync(path.join(paths.game, 'index.html'), path.join(paths.build, 'index.html'))
    fs.copySync(path.join(paths.game, 'favicon.ico'), path.join(paths.build, 'favicon.ico'))

    fs.copy(path.join(paths.game, 'vendor', 'phaser.js'), path.join(paths.build, 'vendor', 'phaser.js'), (err) => {
      if (err) {
        throw err
      } else {
        bundler.bundle().then(() => { p.ok('Build Has Completed.') })
      }
    })

  }
}

module.exports = Build
