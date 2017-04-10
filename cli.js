#!/usr/bin/env node

const Build = require('./lib/build')
const Clean = require('./lib/clean')
const Phaserify = require('./lib/phaserify')

const init = require('./lib/init')

const ArgParser = require('argparse').ArgumentParser
const pkg = require('./package')

const bundler = require('./lib/bundler')
const watcher = require('./lib/watch')

const builder = new Build()
const cleaner = new Clean()
const phaserify = new Phaserify()

const parser = new ArgParser({
  description: 'Phaser Node Kit',
  version: pkg.version,
  allowAbbrev: false,
  epilog: '(c)2017 develephant.com'
})

parser.addArgument('action', {
  help: 'Control the build.',
  choices: [
    'build',
    'clean',
    'init',
    'watch',
    'bundle',
    'phaserify'
  ]
})

const args = parser.parseArgs()

if (args.action === 'build') {
  builder.run()
} else if (args.action === 'clean') {
  cleaner.run()
} else if (args.action === 'bundle') {
  bundler.bundle()
} else if (args.action === 'phaserify') {
  phaserify.run()
} else if (args.action === 'watch') {
  watcher.run()
} else if (args.action === 'init') {
  init.run()
}
