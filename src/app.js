// @flow

let localStorage
if (process.browser) {
  localStorage = window.localStorage
} else {
  const LocalStorage = require('node-localstorage').LocalStorage
  localStorage = new LocalStorage('./localStorage')
}
const Ajax = require('./Ajax')
const Bank = require('./Bank')

const url = 'http://localhost:3000/api/sync'
console.log(`POST to ${url}...`)
new Ajax().post(url, {})
  .then((data: any) => {
    console.log('POST succeeded')
    const bank = new Bank(data)
    console.log('bank.nextId', bank.nextId())
    localStorage.setItem('bank', JSON.stringify(data))
  }).catch(err => {
    console.error(`Error from POST ${url}: ${err}`)
  })
