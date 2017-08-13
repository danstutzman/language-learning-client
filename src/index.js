import Ajax            from './Ajax'
import AjaxBankApi     from './AjaxBankApi'
import App             from './App'
import LocalBank       from './LocalBank'
import LocalStorage    from './LocalStorage'
import React           from 'react'
import ReactDOM        from 'react-dom'
import reducer         from './reducer'
import { createStore } from 'redux'

const clientId = 0
if (localStorage.getItem(LocalStorage.SYNCED_KEY) === null) {
  reinitBank(clientId)
}

function reinitBank(clientId: number) {
	localStorage.setItem(LocalStorage.SYNCED_KEY, JSON.stringify({
		clientId:        clientId,
		syncedActions:   [],
		clientIdToMaxSyncedActionId: new Map()
	}))
	localStorage.setItem(LocalStorage.UNSYNCED_KEY, JSON.stringify({
		unsyncedActions: [],
		nextActionId:    10 + clientId,
	}))
  bank = new LocalBank(
    new AjaxBankApi(new Ajax(), 'http://localhost:3000/api/sync'),
    window.localStorage)
}

let bank = new LocalBank(
  new AjaxBankApi(new Ajax(), 'http://localhost:3000/api/sync'),
  window.localStorage)

function render() {
  ReactDOM.render(
    React.createElement(App, {
      bank: bank,
      reinitBank: ()=>{
        reinitBank(clientId)
        render()
      },
      addCard: ()=>{
        bank.addAction()
        render()
      },
      sync: ()=>{
        console.log('Start syncing')
        bank.sync()
          .then(() => {
            console.log('Done syncing')
            render()
          })
        render()
      }
    }),
    document.getElementById('mount'))
}

document.addEventListener('DOMContentLoaded', ()=>{
  render()
})
