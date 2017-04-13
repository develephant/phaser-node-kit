/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const {p} = require('./utils')
const browserify = require('browserify')
const fs = require('fs-extra')
const path = require('path')
const paths = require('./paths')
const spawn = require('child_process').spawn

const gameJs = path.join(paths.game, 'js')
const buildJs = path.join(paths.build, 'js')

class Bundle {
  constructor() { }

  configureBuildTmpJs() {
    return new Promise((function(resolve, reject) {
      fs.copy(gameJs, buildJs, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    }))
  }

  processBabel() {
    p.log('Running Bundler')
    return new Promise(function(resolve, reject) {
      const cmd = spawn('babel', ['--quiet', buildJs, '--out-dir', buildJs], 
      {cwd:paths.base, stdio: ['pipe', null, null]})
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

  processBrowserify() {
    return new Promise(function(resolve, reject) {
      let ws = fs.createWriteStream(path.join(paths.build, 'bundle.js'))
      let b = browserify(path.join(buildJs, 'index.js'))
        .bundle()
        .pipe(ws)
      
      ws.on('error', (err) => {
        reject(err)
      })

      ws.on('finish', () => {
        fs.remove(buildJs, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    })
  }

  run() {
    return this.configureBuildTmpJs()
      .then(() => {
        console.log('tmp done')
        return this.processBabel()
      })
      .then(() => {
        console.log('babel done')
        return this.processBrowserify()
      })
      .then(() => {
        console.log('browserify done')
      })
      .catch((err) => {
        console.error(err)
      })
  }

}

module.exports = Bundle