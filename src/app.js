// @flow

var REQUIRED_NODE_VERSION = 'v6.11.1'
if (!process.browser && process.version !== REQUIRED_NODE_VERSION) {
  throw new Error(`Currently running ${process.version}.  Please first run: nvm use ${REQUIRED_NODE_VERSION} (may need to rerun npm install)`)
}

const Ajax = require('./Ajax.js')

new Ajax().post('http://localhost:3000/api/sync', {})
  .then(() => {
    console.log('Successfully did POST')
  }).catch((err) => {
    console.error(`Error from POST: ${err}`)
  })
