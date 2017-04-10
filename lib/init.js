/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const path = require('path')
const fs = require('fs-extra')

const {p} = require('../lib/utils')
const paths = require('../lib/paths')

const Build = require('../lib/build')
const builder = new Build()

const spawn = require('child_process').spawn

const pnconfig = require(paths.cli.config)

function run() {

  fs.ensureDir(paths.game)
  fs.ensureDir(paths.build)

  fs.copySync(paths.cli.game, paths.game)

  //copy game to build 
  let copydirs = pnconfig.copy

  let fromDir
  Object.keys(copydirs).map((val) => {
    fromDir = copydirs[val]
    fs.copySync(path.join(paths.game, fromDir), path.join(paths.build, fromDir))
  })

  //index and favicon
  fs.copySync(path.join(paths.game, 'index.html'), path.join(paths.build, 'index.html'))
  fs.copySync(path.join(paths.game, 'favicon.ico'), path.join(paths.build, 'favicon.ico'))

  fs.access(path.join(paths.base, 'package.json'), fs.constants.F_OK, (err) => {
    if (err && (err.code === 'ENOENT')) {
      let npm = spawn('npm', ['init', '-y'], { cwd: process.cwd(), stdio: 'inherit' })
      npm.on('close', (code) => {
        if (code && (code !== 0)) {
          p.err('package.json needed but none found and could not create.')
        } else {
          let pkg = require(path.join(paths.base, 'package.json'))
          pkg.scripts.watch = 'light-server -c pnkit.json'
          pkg.scripts.build = 'pnkit build'
          fs.writeFile(path.join(paths.base, 'package.json'), JSON.stringify(pkg, null, "\t"), (err) => {  
            if (err) {
              throw err
            } else {
              //install light-server
              npm = spawn('npm', ['install', '-D', 'light-server'], { cwd: process.cwd(), stdio: 'inherit' })
              npm.on('close', (code) => {
                if (code && (code !==0)) {
                  throw err
                } else {
                  //config tpl
                  let config = { 
                    include: [], 
                    port: 5550,
                    interval: 750,
                    serve: "build",
                    watchexps: [
                      "game/** # npm run build"
                    ],
                    quiet: true
                  }
                  fs.writeFileSync(path.join(paths.base, 'pnkit.json'), JSON.stringify(config, null, "\t"))
                  fs.copy(path.join(paths.cli.phaser, 'build', 'phaser.js'), path.join(paths.game, 'vendor', 'phaser.js'), (err) => {
                    builder.run()
                    p.log('Added Phaser.js Library.')
                    p.ok('Phaser Node Kit Installed.')
                  })
                }
              })
            }
          })
        }
      })
      npm.on('error', (err) => {
        if (err) { throw err }
      })
    }
  })
}

module.exports.run = run
