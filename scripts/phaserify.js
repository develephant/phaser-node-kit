
const {p, paths} = require('./utils')
const path = require('path')
const fsp = require('@develephant/fsp')
const browserify = require('browserify')

const phaser_inc = `
window.PIXI = require('../node_modules/phaser-ce/build/custom/pixi.js')
window.p2 = require('../node_modules/phaser-ce/build/custom/p2.js')
window.Phaser = require('../node_modules/phaser-ce/build/custom/phaser-split.js')`

function browserifyIt(input_path, output_path) {
  return new Promise(function (resolve, reject) {
    const in_stream = fsp.createWriteStream(output_path)
    let b = browserify(input_path)
      .bundle()
      .pipe(in_stream)

    in_stream.on('finish', () => { resolve() })
    in_stream.on('error', (err) => { reject(err) })
  })
}

function Phaserify() {
  //check for existing bundle
  return fsp.access(path.join(paths.build_vendor, 'phaser-bundle.js'), fsp.constants.F_OK)
  .then()
  .catch((err) => {
    //if bundle missing, create
    if (err && (err.code === 'ENOENT')) {
      return fsp.writeFile(path.join(paths.build, 'phaser.js'), phaser_inc)
      .then(() => { 
        return browserifyIt(path.join(paths.build, 'phaser.js'), path.join(paths.build_vendor, 'phaser-bundle.js'))
      })
      .then(() => {
        return fsp.remove(path.join(paths.build, 'phaser.js')) 
      })
    }
  })
}

function run() {
  p.log('Creating PhaserJS Bundle...')
  return Phaserify()
}

module.exports.run = run
