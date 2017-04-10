#!/usr/bin/env node 

const path = require('path')
const {p, paths} = require('./utils')
const fsp = require('@develephant/fsp')
const spawn = require('child_process').spawn

function emptyDirectory(dir_path) {
  return fsp.emptyDir(dir_path)
}

function rerunPostInstall() {
  const cmd = spawn('npm', ['run', 'postinstall'], {cwd: paths.proj, stdio: 'inherit'})
  cmd.on('close', (code) => {
    if (code !== 0) {
      throw new Error(code)
    }
  })
}

function run() {
  p.title()
  p.warn('Cleaning Build Directories!')
  Promise.all([
    emptyDirectory(paths.build),
    emptyDirectory(paths.dist)
  ])
  .then(() => {
    p.ok('Build Directories Cleaned')
    p.info('Running Post Install...')
    rerunPostInstall()
  })
  .catch((err) => { throw err })
}

run()