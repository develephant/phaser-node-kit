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
const spawn = require('child_process').spawn
const pnconfig = require(paths.cli.config)


// const Bundle = require('../lib/bundle')
// const bundler = new Bundle()

// function run() {

//   fs.ensureDir(paths.game)
//   fs.ensureDir(paths.build)

//   fs.copySync(paths.cli.game, paths.game)

//   //copy game to build 
//   let copydirs = pnconfig.copy

//   //check dirs
//   let fromDir
//   Object.keys(copydirs).map((val) => {
//     fromDir = copydirs[val]
//     fs.ensureDirSync(path.join(paths.game, fromDir))
//     fs.copySync(path.join(paths.game, fromDir), path.join(paths.build, fromDir))
//   })

//   //index and favicon
//   fs.copySync(path.join(paths.game, 'index.html'), path.join(paths.build, 'index.html'))
//   fs.copySync(path.join(paths.game, 'favicon.ico'), path.join(paths.build, 'favicon.ico'))

//   fs.access(path.join(paths.base, 'package.json'), fs.constants.F_OK, (err) => {
//     if (err && (err.code === 'ENOENT')) {
//       let npm = spawn('npm', ['init', '-y'], { cwd: process.cwd(), stdio: 'inherit' })
//       npm.on('close', (code) => {
//         if (code && (code !== 0)) {
//           p.err('package.json needed but none found and could not create.')
//         } else {
//           //config game tpl
//           let phaser_path = path.join(paths.cli.phaser, 'build', 'phaser.js')
//           fs.copySync(path.join(paths.cli.tpl, 'pnkit.json'), path.join(paths.base, 'pnkit.json'))
//           fs.copySync(phaser_path, path.join(paths.build, 'vendor', 'phaser.js'))
//           fs.copy(path.join(paths.cli.phaser, 'build', 'phaser.js'), path.join(paths.game, 'vendor', 'phaser.js'), (err) => {
//             if (err) {
//               console.error(err)
//             } else {
//               bundler.run().then(() => {
//                 p.info('Added Phaser.js')
//                 p.ok('Phaser Node Kit Ready')
//                 p.dashes(60)
//                 p.info('Run "pnkit watch" and start creating your game!')
//                 p.dashes(60)
//               })
//               .catch((err) => {
//                 console.error(err)
//               })
//             }
//           })
//         }
//       })
//       npm.on('error', (err) => {
//         if (err) { throw err }
//       })
//     }
//   })
// }

// module.exports.run = run
