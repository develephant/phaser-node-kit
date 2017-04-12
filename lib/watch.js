/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const {p} = require('./utils')
const build = require('./build')
const bundler = require('./bundler')
const fs = require('fs-extra')
const path = require('path')
const paths = require('./paths')
const get = require('simple-get')
const spawn = require('node-spawn')

const builder = new build()

const buildDelay = 500
const refreshDelay = 500

let buildDelayTimer
let refreshDelayTimer

/* BUILD WATCHER */
function runBuild() {
  builder.run()
}

function runBuildTimer() {
  clearTimeout(buildDelayTimer)
  buildDelayTimer = setTimeout(runBuild, buildDelay)
}

function refresh() {
  //refresh browser
  get('http://127.0.0.1:5550/__lightserver__/trigger', (err, resp) => {
    if (err) {
      console.error(err)
    }
  })
}

function refreshTimer() {
  clearTimeout(refreshDelayTimer)
  refreshDelayTimer = setTimeout(refresh, refreshDelay)
}

function startBuildWatcher() {

  p.title()
  p.fun('\xBB Watch n\' Game Running...')

  //start light-server
  let ls = spawn({
    cmd: 'light-server',
    args: ['-s', paths.build, '-p', '5550', '-q'],
    cwd: path.join(paths.cli.base, 'node_modules', '.bin'),
    onStdout: function(e) { },
    onStderr: function(e) {
      console.error(e.toString())
    }
  })
  ls.once()

  fs.watch(paths.game, {recursive: true}, (evt, fn) => {
    let parts = path.parse(fn)

    if (evt === 'change') {
      if (parts.ext === '.js') {
        runBuildTimer()
      } else {
        if (parts.name !== '.DS_Store') {
          fs.copy(path.join(paths.game, parts.dir, parts.base), path.join(paths.build, parts.base), (err) => {
            if (err) { 
              console.error(err)
            } else {
              p.info(`Updated->${path.join(paths.game, parts.dir, parts.base)}`)
              runBuildTimer()
              //refreshTimer()
            }
          })
        }
      }

    } else if (evt === 'rename') {

      fs.access(path.join(paths.game, parts.dir, parts.base), fs.constants.F_OK, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            //file removed
            fs.remove(path.join(paths.build, parts.dir, parts.base), (err) => {
              if (err) { 
                console.error(err) 
              } else {
                p.warn(`Removed->${path.join(parts.dir, parts.base)}`)
                runBuildTimer()
                //refreshTimer()
              }
            })
          } else {
            if (err) { console.error(err) }
          }
        } else {
          //file added
          if (parts.name !== '.DS_Store') {
            fs.copy(path.join(paths.game, parts.dir, parts.base), path.join(paths.build, parts.base), (err) => {
              if (err) { 
                console.error(err) 
              } else {
                p.info(`Updated->${path.join(parts.dir, parts.base)}`)
                runBuildTimer()
                //refreshTimer()
              }
            })
          }
        }
      })
    }
  })
}

module.exports.run = startBuildWatcher
