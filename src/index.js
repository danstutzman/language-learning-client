import Ajax            from './Ajax'
import AjaxBankApi     from './bank/api/AjaxBankApi'
import App             from './App'
import LocalBank       from './bank/LocalBank'
import React           from 'react'
import ReactDOM        from 'react-dom'
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

function render() {
  ReactDOM.render(
    React.createElement(App, {
      cards: bank.getReduxStoreState(),
      addCard: ()=>{
        bank.addAction()
        render()
      },
      sync: ()=>{
        bank.sync().then(()=>{
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
