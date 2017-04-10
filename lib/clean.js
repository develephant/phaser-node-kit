
const {p} = require('./utils')
const paths = require('./paths')
const fs = require('fs-extra')
const Build = require('./build')

class Clean {
  constructor() { }

  run() {
    p.log('Cleaning...')

    //clean build
    fs.emptyDirSync(paths.build)

    //rebuild
    let builder = new Build()
    builder.run()
  }
}

module.exports = Clean
