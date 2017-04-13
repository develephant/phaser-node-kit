/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const {p} = require('./utils')
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
  }

  refreshPage() {
    console.log('build refresh')

    let watchPort = this.kitconf.watch.port || this.pnconfig.watch.port
    let watchHost = this.kitconf.watch.host || this.pnconfig.watch.host

    get(`http://${watchHost}:${watchPort}/__lightserver__/trigger`, (err, resp) => {
      if (err) {
        console.error(err)
      }
    })
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
  runInitBuild() {
    try {
      //create package json
      this.initBarePackage()
      //check for build dir
      fs.ensureDirSync(paths.build)
      //copy game tpl to project dir
      fs.copySync(paths.cli.game, paths.game)
      //get phaser.js
      console.log(path.join(paths.cli.phaser, 'phaser.js'))
      fs.copySync(path.join(paths.cli.phaser, 'phaser.js'), path.join(paths.game_vendor, 'phaser.js'))
      //copy game to build
      fs.copySync(paths.game, paths.build)
      //copy tpl config
      fs.copySync(path.join(paths.cli.tpl, 'pnkit.json'), path.join(paths.base, 'pnkit.json'))
      //run first bundle
      this.bundler.run().then(() => {
        let d = new Date()
          p.ok(`Build Completed @${d.toLocaleTimeString()}`) 
        })
        .catch((err) => {
          p.err(err)
        })
    }
    catch(err) { 
      console.error(err) 
    }
  }

  //live build, bundles js directory
  //@refresh flag to supress page refresh
  run(refresh=true) {
    this.kitconf = require(paths.config)

    let includeDirs = this.kitconf.include

    includeDirs.map((dir) => {
      fs.copy(path.join(paths.base, dir), paths.build, (err) => {
        if (err) {
          console.error(err)
        }
      })
    })

    this.bundler.run().then(() => {
      let d = new Date()
        p.ok(`Build Completed @${d.toLocaleTimeString()}`)
        if (refresh) {
          this.refreshPage()
        }
      })
      .catch((err) => {
        p.err(err)
      })
  }
}

module.exports = Build

//   run(refresh=true) {

//     p.log('Generating Build')

//     fs.ensureDirSync(paths.build)

//     //copy game to build 
//     let copydirs = pnconfig.copy

//     let fromDir
//     Object.keys(copydirs).map((val) => {
//       fromDir = copydirs[val]
//       fs.ensureDirSync(path.join(paths.game, fromDir))
//       fs.copySync(path.join(paths.game, fromDir), path.join(paths.build, fromDir))
//     })

//     //copy includes
//     let pnkit = require(paths.config)

//     let src
//     pnkit.dirs.game.map((val) => {
//       try {
//         src = path.join(paths.game, val) 
//         fs.copySync(src, path.join(pnkit.watch.dir, val))
//       } catch(err) {
//         if (err) {
//           p.err(`Could not locate ${src}`)
//         }
//       }
//     })

//     pnkit.dirs.external.map((val) => {
//       try {
//         src = path.join(paths.base, val)
//         fs.copySync(src, path.join(paths.build, val))
//       } catch(err) {
//         if (err) { p.err(`Could not locate ${src}`) }
//       }
//     })

//     //index and favicon
//     fs.copySync(path.join(paths.game, 'index.html'), path.join(paths.build, 'index.html'))
//     fs.copySync(path.join(paths.game, 'favicon.ico'), path.join(paths.build, 'favicon.ico'))

//     fs.copy(path.join(paths.game, 'vendor', 'phaser.js'), path.join(paths.build, 'vendor', 'phaser.js'), (err) => {
//       if (err) {
//         console.error(err)
//       } else {
//         this.bundler.run().then(() => {
//           if (refresh === true) {
//             this.refresh()
//           }
//           let d = new Date()
//           p.ok(`Build Completed @${d.toLocaleTimeString()}`) 
//         })
//         .catch((err) => {
//           p.err(err)
//         })
//       }
//     })
//   }
// }

