/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const {p} = require('./utils')
const browserify = require('browserify')
const fsp = require('@develephant/fsp')
const path = require('path')
const paths = require('./paths')
const spawn = require('child_process').spawn
const util = require('util')

const bundle_js = path.join(paths.build, 'bundle.js')
const game_js = path.join(paths.game, 'js')
const build_js = paths.build
const appbase = paths.base
const index_js = path.join(paths.game, 'js', 'index.js')

function processBabel() {
  p.log('Running Bundler')
  return new Promise(function(resolve, reject) {
    const cmd = spawn('babel', ['--quiet', game_js, '-d', build_js], {cwd:appbase, stdio: ['pipe', null, null]})
    cmd.on('close', (code) => {
      if (code !== 0) {
        return reject(`Babel was unable to transpile the code. Check syntax. (err: ${code})`)
      } else {
        resolve()
      }
    })
    cmd.on('error', (err) => {
      return reject(err)
    })
  })
}

function processBrowserify() {
  return new Promise(function(resolve, reject) {
    const ws = fsp.createWriteStream(bundle_js)
    const b = browserify(index_js)
      .bundle()
      .pipe(ws)

    ws.on('finish', () => {
      //clean
      fsp.remove(path.join(paths.build, 'index.js'), (err) => {
        if (err) { 
          console.error(err)
        } else {
          fsp.remove(path.join(paths.build, 'states'), (err) => {
          if (err) { 
            console.error(err)
          } else {
            resolve()
          }
          })
        }
      })
    })

    ws.on('error', (err) => {
      return reject(err)
    })
  })
}

function bundle() {
  return processBabel()
  .then(() => {
    return processBrowserify()
  })
  .then(() => {
    p.info('Bundle Updated')
  })
  .catch((err) => { p.err(err) } )
}

module.exports.bundle = bundle