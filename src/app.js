// @flow

const Ajax = require('./Ajax.js')
new Ajax().post('http://localhost:3000/api/sync', {})
  .then(() => {
    console.log('Successfully did POST')
  }).catch((err) => {
    console.error(`Error from POST: ${err}`)
  })
