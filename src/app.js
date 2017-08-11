// @flow

const Ajax = require('./Ajax.js')
new Ajax().post('http://localhost:3000/api/sync', {})
  .then((data: any) => {
    console.log('Successfully did POST', data)
  }).catch(err => {
    console.error(`Error from POST: ${err}`)
  })

let localStorage
if (process.browser) {
  localStorage = window.localStorage
} else {
  const LocalStorage = require('node-localstorage').LocalStorage
  localStorage = new LocalStorage('./localStorage')
}

localStorage.setItem('myFirstKey', 'myFirstValue')
console.log(localStorage.getItem('myFirstKey'))
