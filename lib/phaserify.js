/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const path = require('path')
const fs = require('fs-extra')
const browserify = require('browserify')
const {p} = require('./utils')
const paths = require('./paths')

class Phaserify {
  constructor() {}

  run() {
    //phaserify
    const phaser_inc = `
    window.PIXI = require('${paths.cli.phaser}/build/custom/pixi.js')
    window.p2 = require('${paths.cli.phaser}/build/custom/p2.js')
    window.Phaser = require('${paths.cli.phaser}/build/custom/phaser-split.js')`

    fs.access(path.join(paths.build_vendor, 'phaser-bundle.js'), fs.constants.F_OK, (err) => {
      if (err && (err.code === 'ENOENT')) {
        //missing
        fs.writeFile(path.join(paths.build_vendor, 'phaser.js'), phaser_inc, (err) => {
          if (err) {
            throw err
          }

          const input_path = path.join(path.join(paths.build_vendor, 'phaser.js'))
          const output_path = path.join(path.join(paths.build_vendor), 'phaser-bundle.js')
          const in_stream = fs.createWriteStream(output_path)
          const b = browserify(input_path)
            .bundle()
            .pipe(in_stream)

          in_stream.on('finish', () => {
            fs.removeSync(path.join(paths.build_vendor, 'phaser.js'))
            p.ok('Phaserify is done!')
            p.info('Run "pnkit build" to get started.')
          })

          in_stream.on('error', (err) => {
            if (err) { throw err }
          })
        })
      }
    })
  }
}

module.exports = Phaserify
