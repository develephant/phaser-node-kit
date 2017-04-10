#!/usr/bin/env node 

const path = require('path')
const fsp = require('@develephant/fsp')
const {p, paths} = require('./utils')
const phaserify = require('./phaserify')

function createDirectory(dir_path) {
  return fsp.ensureDir(dir_path)
}

function copy(source, dest) {
  return fsp.copy(source, dest)
}

//scaffold game directory with missing folders 
function createTree() {
  return Promise.all([
    createDirectory(paths.build),
    createDirectory(paths.dist),
    createDirectory(path.join(paths.game, 'data')),
    createDirectory(path.join(paths.game, 'font')),
    createDirectory(path.join(paths.game, 'snd')),
    createDirectory(path.join(paths.game, 'vendor')),

    copy(path.join(paths.game, 'css'),          path.join(paths.build, 'css')),
    copy(path.join(paths.game, 'data'),         path.join(paths.build, 'data')),
    copy(path.join(paths.game, 'font'),         path.join(paths.build, 'font')),
    copy(path.join(paths.game, 'img'),          path.join(paths.build, 'img')),
    copy(path.join(paths.game, 'snd'),          path.join(paths.build, 'snd')),
    copy(path.join(paths.game, 'vendor'),       path.join(paths.build, 'vendor')),
    copy(path.join(paths.game, 'favicon.ico'),  path.join(paths.build, 'favicon.ico')),
    copy(path.join(paths.game, 'index.html'),   path.join(paths.build, 'index.html'))
  ])
}

/* RUNNER */
function run () {
  p.title()
  p.log('Creating Project Tree...')
  createTree()
  .then(() => { p.info('Project Tree Created') })
  .then(() => { return phaserify.run() })
  .then(() => { 
    p.info('PhaserJS Bundle Added')
    p.ok('Post Install Completed')})
  .catch((err) => { p.err(err) })
}

run()
