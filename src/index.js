const Ajax             = require('./Ajax')
const AjaxBankApi      = require('./AjaxBankApi')
const App              = require('./App')
const LocalBank        = require('./LocalBank')
const LocalStorage     = require('./LocalStorage')
const React            = require('react')
const ReactDOM         = require('react-dom')

if (localStorage.getItem(LocalStorage.SYNCED_KEY) === null) {
  const clientId = 0
	localStorage.setItem(LocalStorage.SYNCED_KEY, JSON.stringify({
		clientId:        clientId,
		syncedActions:   [],
		clientIdToMaxSyncedActionId: new Map()
	}))
	localStorage.setItem(LocalStorage.UNSYNCED_KEY, JSON.stringify({
		unsyncedActions: [],
		nextActionId:    10 + clientId,
	}))
}

const bank = new LocalBank(
  new AjaxBankApi(new Ajax(), 'http://localhost:3000/api/sync'),
  window.localStorage)

document.addEventListener('DOMContentLoaded', ()=>{
  ReactDOM.render(
    React.createElement(App, { bank }),
    document.getElementById('mount'))
})

bank.sync()
  .then(() => { console.log('Done syncing') })
  .catch(e => { console.error(`Error syncing:`, e) })
