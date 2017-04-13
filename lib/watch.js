/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const {p} = require('./utils')
const Build = require('./build')
const bundler = require('./bundler')
const fs = require('fs-extra')
const path = require('path')
const paths = require('./paths')
const get = require('simple-get')
const spawn = require('node-spawn')
const watch = require('node-watch')

//const builder = new build()

const compileDelay = 500
const refreshDelay = 500

let compileDelayTimer
let refreshDelayTimer

let lightServer
let pnconfig

/* BUILD WATCHER */
class Watcher {
  constructor() {
    console.log('watcher inited')

    this.buildDir = null

    this.compileDelay = 500
    this.refreshDelay = 500

    this.compileDelayTimer = null
    this.refreshDelayTimer = null

    this.ignoredFiles = []
  }

  isFileAllowed(filename) {
    let parts = path.parse(filename)

    let ext = parts.ext
    let base = parts.base

    let isAllowed = true
    this.ignoredFiles.map((restricted) => {
      if ((base === restricted) || (ext === restricted)) {
        isAllowed = false
      }
    })

    return isAllowed
  }

  refresh() {
    console.log('refresh')
    // get('http://127.0.0.1:5550/__lightserver__/trigger', (err, resp) => {
    //   if (err) { console.error(err) }
    // })
  }

  //if js file found queue up compile
  //add a delay in case of multiple files
  startCompileDelay() {
    clearTimeout(this.compileDelayTimer)
    this.compileDelayTimer = setTimeout(() => {
      this.bundleJs()
    }, this.compileDelay)
  }

  //if asset files are updated, refresh browser
  startRefreshDelay() {
    clearTimeout(this.refreshDelayTimer)
    this.refreshDelayTimer = setTimeout(this.refresh, this.refreshDelay)
  }

  //add asset files
  copyToBuild(source) {
    if (this.isFileAllowed(source)) {
      let buildPath = source.replace('game', this.buildDir)

      fs.copy(source, buildPath, (err) => {
        console.log('copied')
        this.startRefreshDelay()
      })

    }
  }

  //remove assets files
  removeFromBuild(source) {
    let buildPath = source.replace('game', this.buildDir)

    fs.remove(buildPath, (err) => {
      console.log('removed')
      this.startRefreshDelay()
    })
  }

  //bundle the js files
  bundleJs() {
    console.log('compile js')
    this.builder.run()
  }

  startServer() {
    //spawn light-server
    let port = this.pnconfig.watch.port.toString()
    let host = this.pnconfig.watch.host
    let dir = this.pnconfig.watch.dir

    lightServer = spawn({
      cmd: 'light-server',
      args: ['-s', dir, '-p', port, '-b', host, '-q'],
      cwd: path.join(paths.cli.base, 'node_modules', '.bin'),
      onStdout: function(e) { },
      onStderr: function(e) {
        console.error(e.toString())
      }
    })
    ls.once()
  }

  startWatch() {
    let parts
    watch(paths.game, { recursive: true }, (evt, filename) => {
      parts = path.parse(filename)
      if (evt === 'update') {
        if (parts.ext === '.js') {
          this.startCompileDelay()
        } else {
          this.copyToBuild(filename)
        }
      } else if (evt === 'remove') {
        this.removeFromBuild(filename)
      }
    })
  }

  run() {
    console.log('starting watcher')

    //load config
    this.pnconfig = require(paths.config)

    this.buildDir = this.pnconfig.watch.dir
    this.ignoredFiles = this.pnconfig.files.ignore
    this.refreshDelay = this.pnconfig.watch.refreshDelay

    this.builder = new Build()

    //this.startServer()
    this.startWatch()


  }
}

module.exports = Watcher



// function runBuild() {
//   builder.run()
// }

// function runBuildTimer() {
//   clearTimeout(buildDelayTimer)
//   buildDelayTimer = setTimeout(runBuild, buildDelay)
// }

// function refresh() {
//   //refresh browser
//   get('http://127.0.0.1:5550/__lightserver__/trigger', (err, resp) => {
//     if (err) {
//       console.error(err)
//     }
//   })
// }

// function refreshTimer() {
//   clearTimeout(refreshDelayTimer)
//   refreshDelayTimer = setTimeout(refresh, refreshDelay)
// }

// function startBuildWatcher() {

//   p.title()
//   p.fun('\xBB Watch n\' Game Running...')

//   //start light-server
//   let ls = spawn({
//     cmd: 'light-server',
//     args: ['-s', paths.build, '-p', '5550', '-q'],
//     cwd: path.join(paths.cli.base, 'node_modules', '.bin'),
//     onStdout: function(e) { },
//     onStderr: function(e) {
//       console.error(e.toString())
//     }
//   })
//   ls.once()

//   fs.watch(paths.game, {recursive: true}, (evt, fn) => {
//     let parts = path.parse(fn)

//     if (evt === 'change') {
//       if (parts.ext === '.js') {
//         runBuildTimer()
//       } else {
//         if (parts.name !== '.DS_Store') {
//           fs.copy(path.join(paths.game, parts.dir, parts.base), path.join(paths.build, parts.base), (err) => {
//             if (err) { 
//               console.error(err)
//             } else {
//               p.info(`Updated->${path.join(paths.game, parts.dir, parts.base)}`)
//               runBuildTimer()
//               //refreshTimer()
//             }
//           })
//         }
//       }

//     } else if (evt === 'rename') {

//       fs.access(path.join(paths.game, parts.dir, parts.base), fs.constants.F_OK, (err) => {
//         if (err) {
//           if (err.code === 'ENOENT') {
//             //file removed
//             fs.remove(path.join(paths.build, parts.dir, parts.base), (err) => {
//               if (err) { 
//                 console.error(err) 
//               } else {
//                 p.warn(`Removed->${path.join(parts.dir, parts.base)}`)
//                 runBuildTimer()
//                 //refreshTimer()
//               }
//             })
//           } else {
//             if (err) { console.error(err) }
//           }
//         } else {
//           //file added
//           if (parts.name !== '.DS_Store') {
//             fs.copy(path.join(paths.game, parts.dir, parts.base), path.join(paths.build, parts.base), (err) => {
//               if (err) { 
//                 console.error(err) 
//               } else {
//                 p.info(`Updated->${path.join(parts.dir, parts.base)}`)
//                 runBuildTimer()
//                 //refreshTimer()
//               }
//             })
//           }
//         }
//       })
//     }
//   })
// }

// module.exports.run = startBuildWatcher
