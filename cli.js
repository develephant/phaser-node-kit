#!/usr/bin/env node

/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
const ArgParser = require('argparse').ArgumentParser
const Build = require('./lib/build')
const Clean = require('./lib/clean')
const Watch = require('./lib/watch')

const pkg = require('./package')

const builder = new Build()
const cleaner = new Clean()
const watcher = new Watch()

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
    'clean',
  ]
})

const args = parser.parseArgs()

if (args.action === 'clean') {
  cleaner.run()
} else if (args.action === 'watch') {
  watcher.run()
} else if (args.action === 'init') {
  builder.runInitBuild()
}
