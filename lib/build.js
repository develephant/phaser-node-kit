/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const { pp } = require('./utils')
const fs = require('fs-extra')
const get = require('simple-get')
const path = require('path')
const paths = require('./paths')
const spawn = require('child_process').spawnSync

const Bundle = require('./bundle')

class Build {
  constructor() { 
    this.bundler = new Bundle()
    this.pnconfig = require(paths.cli.config)
    this.kitconf = null
    this.shouldRefresh = true
  }

  refreshPage() {
    if (this.shouldRefresh) {
      let watchPort = this.kitconf.watch.port || this.pnconfig.watch.port
      let watchHost = this.kitconf.watch.host || this.pnconfig.watch.host

      get(`http://${watchHost}:${watchPort}/__lightserver__/trigger`, (err, resp) => {
        if (err) {
          pp.err(err)
        }
      })
    }
  }

  //render bare package.json 
  initBarePackage() {
    fs.access(path.join(paths.base, 'package.json'), fs.constants.F_OK, (err) => {
      if (err && (err.code === 'ENOENT')) {
        const npm = spawn('npm', ['init', '-y'], { cwd: paths.base, stdio: null })
      }
    })
  }

  //run by the init script to set up
  //the initial kit scaffolding
  //we can do this sync'd
  //isClean = true for a clean (non-init) build
  runInitBuild(isSync) {
    try {
      //ensure a build dir
      fs.ensureDirSync(paths.build)

      //check for clean build
      if (isSync) {
        pp.log('Syncing Build')
        //clear build dir 
        fs.emptyDirSync(paths.build)
      } else {
        pp.info('Initializing The Kit')
        this.initBarePackage()
        //copy tpl config
        fs.copySync(path.join(paths.cli.tpl, 'pnkit.json'), path.join(paths.base, 'pnkit.json'))
        //copy game tpl to project dir
        fs.copySync(paths.cli.game, paths.game)
        //copy phaser-ce js
        pp.log('Adding Phaser.js')
        fs.copySync(path.join(paths.cli.phaser, 'phaser.min.js'), path.join(paths.game_vendor, 'phaser.min.js'))
      }

      //copy game to build
      fs.copySync(paths.game, paths.build)

      //run first bundle
      this.bundler.run().then(() => {
          if (isSync) {
            let d = new Date()
            pp.ok(`Build Ready @${d.toLocaleTimeString()}`)
          } else {
            pp.title()
            pp.dashes(65)
            pp.info('To get started type "pnkit watch" and start building your game!')
            pp.log(`View a live build in your browser at: http://127.0.0.1:5550`)
            pp.dashes(65)
          }
        })
        .catch((err) => {
          pp.err(err)
        })
    }
    catch(err) { 
      pp.err(err) 
    }
  }

  //live build, bundles js directory
  //@refresh flag to supress page refresh
  run(refresh=true) {
    this.kitconf = require(paths.config)
    this.shouldRefresh = this.kitconf.watch.refresh

    this.bundler.run().then(() => {
      let d = new Date()
        pp.ok(`Build Ready @${d.toLocaleTimeString()}`)
        if (refresh) {
          this.refreshPage()
        }
      })
      .catch((err) => {
        pp.err(err)
      })
  }
}

module.exports = Build
