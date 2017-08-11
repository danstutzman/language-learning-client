// @flow

let localStorage
if (process.browser) {
  localStorage = window.localStorage
} else {
  const LocalStorage = require('node-localstorage').LocalStorage
  localStorage = new LocalStorage('./localStorage')
}
const LocalBank = require('./LocalBank')
const BankApi = require('./BankApi').BankApi

const bank = new LocalBank(localStorage,
  new BankApi('http://localhost:3000/api/sync'))

bank.sync()
  .then(() => { console.log('Done syncing') })
  .catch(e => { console.error(`Error syncing: ${e}`) })
