import type { Action } from './Action'
import Ajax            from './Ajax'
import AjaxBankApi     from './AjaxBankApi'
import App             from './App'
import LocalBank       from './LocalBank'
import React           from 'react'
import ReactDOM        from 'react-dom'
import reducer         from './reducer'
import { createStore } from 'redux'
import { SYNCED_KEY, UNSYNCED_KEY } from '../src/LocalStorage'

const clientId = 1
if (localStorage.getItem(SYNCED_KEY) === null) {
	localStorage.setItem(SYNCED_KEY, JSON.stringify({
		clientId:                    clientId,
		actions:                     [],
		clientIdToMaxSyncedActionId: new Map()
	}))
	localStorage.setItem(UNSYNCED_KEY, JSON.stringify({
		actions:      [],
		nextActionId: 10 + clientId,
	}))
}

const bank = new LocalBank(
  new AjaxBankApi(new Ajax(), 'http://localhost:3000/api/sync'),
  window.localStorage)
bank.initFromLocalStorage()
const store = createStore(reducer, {})
for (const action of bank.syncedState.actions.concat(
      bank.unsyncedState.actions)) {
  store.dispatch(action)
}

function render() {
  ReactDOM.render(
    React.createElement(App, {
      cards: store.getState(),
      addCard: ()=>{
        const action: Action = bank.addAction()
        store.dispatch(action)
        render()
      },
      sync: ()=>{
        bank.sync()
          .then(newActions => {
            for (const action of newActions) {
              store.dispatch(action)
            }
            render()
            console.log('Done syncing')
          })
        render()
      }
    }),
    document.getElementById('mount'))
}

document.addEventListener('DOMContentLoaded', ()=>{
  render()
})
