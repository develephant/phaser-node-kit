/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const { pp } = require('./utils')
const browserify = require('browserify')
const fs = require('fs-extra')
const path = require('path')
const paths = require('./paths')
const spawn = require('child_process').spawn

const gameJs = path.join(paths.game, 'js')
const buildJs = path.join(paths.build, 'js')

const debug = paths.config.debug || false

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

  processBrowserify() {
    pp.info('Running Bundler')
    return new Promise(function(resolve, reject) {
      let ws = fs.createWriteStream(path.join(paths.build, 'bundle.js'), {debug: true})
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
        return this.processBrowserify()
      })
      .catch((err) => {
        pp.err(err)
      })
  }

}

module.exports = Bundle
