#!/usr/bin/env node 

const {p, paths} = require('./utils')
const bundler = require('./bundler')
const path = require('path')
const fsp = require('@develephant/fsp')

/* ASSET DIRECTORIES */
function copyToBuild(target) {
  return new Promise(function(resolve, reject) {
    fsp.copy(path.join(paths.game, target), path.join(paths.build, target))
    .then(() => { resolve(`Copy: game/${target}->build/${target}`) })
    .catch((err) => { return reject(err) })
  })
}

function initAssets() {
  p.log('Creating Build Tree...')
  const init_assets = ['css', 'data', 'font', 'img', 'snd', 'vendor', 'index.html', 'favicon.ico']
  const tasks = []
  init_assets.map((target) => {
    tasks.push(copyToBuild(target))
  })
  return Promise.all(tasks)
}

/* BUILD WATCHER */
function startBuildWatcher() {
  p.ok('Watch and Build Running...')
  fsp.watch(paths.game, {recursive: true}, (evt, fn) => {
    let parts = path.parse(fn)
    if (evt === 'change') {
      if (parts.ext === '.js') {
        bundler.bundle()
      } else {
        if (parts.name !== '.DS_Store') {
          copyToBuild(path.join(parts.dir, parts.base))
          .catch((err) => { p.err(err) })
        }
      }
    } else if (evt === 'rename') {
      fsp.access(path.join(paths.game, parts.dir, parts.base), fsp.constants.F_OK, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            //file removed
            fsp.remove(path.join(paths.build, parts.dir, parts.base), (err) => {
              if (err) { throw err }
            })
          } else {
            throw err
          }
        } else {
          //file added
          copyToBuild(path.join(parts.dir, parts.base))
          .then((res) => { p.info(res) })
          .catch((err) => { p.err(err) })
        }
      })
    }
  })
}

/* INIT */
function run() {
  p.title()

  initAssets()
  .then((res) => {
    res.map((r) => { p.info(r) })

    bundler.bundle()
    .then(() => { startBuildWatcher() })
  })
  .catch((err) => { p.err(err) })
}

run()
