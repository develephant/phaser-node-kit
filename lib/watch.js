/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const { pp } = require('./utils')
const fs = require('fs-extra')
const path = require('path')
const paths = require('./paths')
const get = require('simple-get')
const spawn = require('child_process').spawn
const watch = require('node-watch')

const Build = require('./build')

/* BUILD WATCHER */
class Watcher {
  constructor() {
    console.log('watcher inited')

    this.pnconfig = null

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
    console.log('watch refresh')
    get(`http://${this.pnconfig.watch.host}:${this.pnconfig.watch.port}/__lightserver__/trigger`, (err, resp) => {
      if (err) { console.error(err) }
    })
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
    this.refreshDelayTimer = setTimeout(() => {
      this.refresh()
    }, this.refreshDelay)
  }

  //add asset files
  copyToBuild(source) {
    if (this.isFileAllowed(source)) {
      let buildPath = source.replace('game', 'build')
      fs.copy(source, buildPath, (err) => {
        console.log('copied')
        this.startRefreshDelay()
      })

    }
  }

  //remove assets files
  removeFromBuild(source) {
    let buildPath = source.replace('game', 'build')
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
    console.log('start server')
    //spawn light-server
    let port = this.pnconfig.watch.port.toString()
    let host = this.pnconfig.watch.host
    let dir = paths.build

    const lightServer = spawn('light-server', ['-s', dir, '-p', port, '-b', host, '-q'], 
    { cwd: path.join(paths.cli.base, 'node_modules', '.bin'), stdio: 'inherit' } )
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

    this.ignoredFiles = this.pnconfig.ignore
    this.refreshDelay = this.pnconfig.watch.refreshDelay

    this.builder = new Build()

    this.startServer()
    this.startWatch()

  }
}

module.exports = Watcher
