
const path = require('path')

const clr = require('colors/safe')
//colors
clr.setTheme({
  ok: ['bold', 'green'],
  log: 'cyan',
  info: ['bold', 'blue'],
  warn: ['bold', 'yellow'],
  err: ['bold', 'red'],
  title: ['bold', 'red', 'bgBlack'],
  fun: 'rainbow'
})

const proj_dir = process.cwd()

//paths
const paths = {
  proj: proj_dir,
  game: path.join(proj_dir, 'game'),
  build: path.join(proj_dir, 'build'),
  dist: path.join(proj_dir, 'dist'),
  build_vendor: path.join(proj_dir, 'build', 'vendor'),
  game_vendor: path.join(proj_dir, 'game', 'vendor'),
  game_js: path.join(proj_dir, 'game', 'js'),
  build_js: path.join(proj_dir, 'build', 'js'),
  index_js: path.join(proj_dir, 'build', 'js', 'index.js'),
  bundle_js: path.join(proj_dir, 'build', 'bundle.js')
}

//styling
function dashes(amt=80) {
  console.log(clr.fun('-'.repeat(amt)))
}

//utils
module.exports.paths = paths
module.exports.clr = clr

module.exports.p = {
  ok: function(str) {
    console.log(clr.ok(`\xBB ${str}`))
  },
  info: function(str) {
    console.log(clr.info(`\xBB ${str}`))
  },
  warn: function(str) {
    console.log(clr.warn(`\xBB ${str}`))
  },
  err: function(str) {
    console.log(clr.err(`\xBB ${str}`))
  },
  log: function(str) {
    console.log(clr.log(`\xBB ${str}`))
  },
  title: function() {
    console.log(clr.title('\xBB Phaser Node Kit \xAB'))
  },
  fun: function(str) {
    console.log(clr.fun(str))
  },
  dashes: function(amt) {
    dashes(amt)
  }
}
