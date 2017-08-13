import Ajax            from './Ajax'
import AjaxBankApi     from './AjaxBankApi'
import App             from './App'
import LocalBank       from './LocalBank'
import LocalStorage    from './LocalStorage'
import React           from 'react'
import ReactDOM        from 'react-dom'
import reducer         from './reducer'
import { createStore } from 'redux'

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
const store = createStore(reducer, [])

function render() {
  ReactDOM.render(
    React.createElement(App, {
      actions: store.getState(),
      addCard: ()=>{
        store.dispatch({ type: 'ADD_CARD', actionId: 0 })
        render()
      }
    }),
    document.getElementById('mount'))
}

document.addEventListener('DOMContentLoaded', ()=>{
  render()
})

bank.sync()
  .then(() => { console.log('Done syncing') })
  .catch(e => { console.error(`Error syncing:`, e) })
