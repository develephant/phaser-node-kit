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
    this.pnconfig = null

    this.compileDelay = 500
    this.refreshDelay = 500

    this.shouldRefresh = true

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
    if (this.shouldRefresh) {
      get(`http://${this.pnconfig.watch.host}:${this.pnconfig.watch.port}/__lightserver__/trigger`, (err, resp) => {
        if (err) { console.error(err) }
      })
    }
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
      //nasty hack - fix this or no dessert.
      let sep = path.sep
      let re = new RegExp(sep+'game'+sep)
      let buildPath = source.replace(re, `${sep}build${sep}`)
      
      console.log(source, buildPath)

      fs.copy(source, buildPath, (err) => {
        if (err) {
          pp.err(err)
        } else {
          let parts = path.parse(source)
          pp.ok(`Added->${parts.base}`)
          this.startRefreshDelay()
        }
      })

    }
  }

  //remove assets files
  removeFromBuild(source) {
    //nasty hack - fix this or no dessert.
    let sep = path.sep
    let re = new RegExp(sep+'game'+sep)
    let buildPath = source.replace(re, `${sep}build${sep}`)

    console.log(source, buildPath)
    fs.remove(buildPath, (err) => {
      if (err) {
        pp.err(err)
      } else {
        let parts = path.parse(source)
        pp.warn(`Removed->${parts.base}`)
        this.startRefreshDelay()
      }
    })
  }

  //bundle the js files
  bundleJs() {
    this.builder.run()
  }

  startServer() {
    //spawn light-server
    let port = this.pnconfig.watch.port.toString()
    let host = this.pnconfig.watch.host
    let dir = paths.build

    const lightServer = spawn('light-server', ['-s', dir, '-p', port, '-b', host, '-q'], 
    { cwd: path.join(paths.cli.base, 'node_modules', '.bin'), stdio: null } )
  }

  startWatch() {
    watch(paths.game, { recursive: true }, (evt, filename) => {
      let parts = path.parse(filename)
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

    pp.ok('Development Mode Activated')
  }

  run() {
    this.pnconfig = require(paths.config)

    this.ignoredFiles = this.pnconfig.ignore
    this.shouldRefresh = this.pnconfig.watch.refresh

    this.builder = new Build()

    this.startServer()
    this.startWatch()

  }
}

module.exports = Watcher
