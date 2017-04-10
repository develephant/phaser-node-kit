/**
 * phaser-node-kit
 * @author C. Byerley
 * @copyright (c)2017 develephant.com
 * @license MIT
 * https://github.com/develephant/phaser-node-kit
 */
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

//styling
function dashes(amt=80) {
  console.log(clr.fun('-'.repeat(amt)))
}

//utils
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
