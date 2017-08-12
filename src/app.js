// @flow

const Ajax             = require('./Ajax')
const AjaxBankApi      = require('./AjaxBankApi')
const FakeLocalStorage = require('../test/FakeLocalStorage')
const LocalBank        = require('./LocalBank')

const storage = new FakeLocalStorage(0)
const bank = new LocalBank(
  new AjaxBankApi(new Ajax(), 'http://localhost:3000/api/sync'),
  storage)
bank.addAction()

bank.sync()
  .then(() => { console.log('Done syncing') })
  .catch(e => { console.error(`Error syncing:`, e) })
