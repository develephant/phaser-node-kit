#!/usr/bin/env node

/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const pkg = require('./package')
const ArgParser = require('argparse').ArgumentParser

const Build = require('./lib/build')
const Watch = require('./lib/watch')
const Update = require('./lib/update')

const builder = new Build()
const watcher = new Watch()
const updater = new Update()

const parser = new ArgParser({
  description: 'Phaser Node Kit',
  version: pkg.version,
  allowAbbrev: false,
  epilog: '(c)2017 develephant.com'
})

parser.addArgument('action', {
  help: 'Phaser Node Kit Actions',
  choices: [
    'init',
    'watch',
    'sync',
    'update'
  ]
})

const args = parser.parseArgs()

if (args.action === 'sync') {
  builder.runInitBuild(true)
} else if (args.action === 'watch') {
  watcher.run()
} else if (args.action === 'init') {
  builder.runInitBuild()
} else if (args.action === 'update') {
  updater.run()
}
