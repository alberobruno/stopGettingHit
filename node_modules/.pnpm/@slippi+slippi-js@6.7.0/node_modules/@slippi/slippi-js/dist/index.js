
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./slippi-js.cjs.production.min.js')
} else {
  module.exports = require('./slippi-js.cjs.development.js')
}
