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

/* BUILD WATCHER */
function startBuildWatcher() {
  p.title()
  p.ok('Watch and Build Running...')

  fs.watch(paths.game, {recursive: true}, (evt, fn) => {
    let parts = path.parse(fn)

    if (evt === 'change') {
      if (parts.ext === '.js') {

        //create bundle.js
        bundler.bundle()

      } else {
        if (parts.name !== '.DS_Store') {
          fs.copy(path.join(paths.game, parts.dir, parts.base), path.join(paths.build, parts.base), (err) => {
            if (err) { 
              throw err 
            } else {
              p.info(`Updated->${path.join(paths.game, parts.dir, parts.base)}`)
            }
          })
        }
      }

    } else if (evt === 'rename') {

      fs.access(path.join(paths.game, parts.dir, parts.base), fsp.constants.F_OK, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            //file removed
            fs.remove(path.join(paths.build, parts.dir, parts.base), (err) => {
              if (err) { 
                throw err 
              } else {
                p.info(`Removed->${path.join(parts.dir, parts.base)}`)
              }
            })
          } else {
            if (err) { throw err }
          }
        } else {
          //file added
          fs.copy(path.join(parts.dir, parts.base), path.join(paths.build, parts.base), (err) => {
            if (err) { 
              throw err 
            } else {
              p.info(`Updated->${path.join(parts.dir, parts.base)}`)
            }
          })
        }
      })
    }
  })
}

module.exports.run = startBuildWatcher
