
const {p, paths} = require('./utils')
const fsp = require('@develephant/fsp')
const browserify = require('browserify')
const spawn = require('child_process').spawn

function processBabel() {
  p.log('Running Babel...')
  return new Promise(function(resolve, reject) {
    const cmd = spawn('babel', ['--quiet', paths.game_js, '-d', paths.build_js], {cwd:paths.proj, stdio: ['pipe', null, null]})
    cmd.on('close', (code) => {
      if (code !== 0) {
        return reject(`Babel was unable to transpile the code. Check syntax. (err: ${code})`)
      } else {
        resolve()
      }
    })
    cmd.on('error', (err) => {
      return reject(err)
    })
  })
}

function processBrowserify() {
  p.log('Running Browserify...')
  return new Promise(function(resolve, reject) {
    const ws = fsp.createWriteStream(paths.bundle_js)
    const b = browserify(paths.index_js)
      .bundle()
      .pipe(ws)

    ws.on('finish', () => {
      resolve()
    })

    ws.on('error', (err) => {
      return reject(err.code)
    })
  })
}

function bundle() {
  return processBabel()
  .then(() => {
    return processBrowserify()
  })
  .then(() => {
    p.info('Game Bundle Updated.')
  })
  .catch((err) => { p.err(err) } )
}

module.exports.bundle = bundle