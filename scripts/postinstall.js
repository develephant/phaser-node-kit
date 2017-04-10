#!/usr/bin/env node
/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const path = require('path')
const fs = require('fs-extra')
const browserify = require('browserify')

const {p} = require('../lib/utils')
const paths = require('../lib/paths')

const Phaserify = require('../lib/phaserify')
const phaserBundle = new Phaserify()

const Build = require('../lib/build')
const builder = new Build()

const pnconfig = require(paths.cli.config)

function run() {

  //scaffold some dirs 
  fs.ensureDirSync(paths.build)

  //copy game tpl dir 
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

  //config tpl
  let config = { include: [] }
  fs.writeFileSync(path.join(paths.base, 'pnkit.json'), JSON.stringify(config, null, "\t"))

  builder.run()

  p.ok('Post Install Done.')
}

module.exports.run = run
