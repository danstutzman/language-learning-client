import type { Card }     from './Card'
import type { Exposure } from './Exposure'
import type { Action }   from './bank/Action'
import Ajax              from './Ajax'
import AjaxBankApi       from './bank/api/AjaxBankApi'
import App               from './App'
import LocalBank         from './bank/LocalBank'
import React             from 'react'
import ReactDOM          from 'react-dom'
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
  new AjaxBankApi(new Ajax(), 'https://serverdts.localtunnel.me/api/sync'),
  window.localStorage)
bank.initFromLocalStorage()

function chooseRandomCard(actions: Array<Action>): Action | null {
  const newCardActions = actions.filter(card => {
    return card.type === 'ADD_CARD'
  })
  const cardNum = Math.floor(Math.random() * newCardActions.length)
  return newCardActions.length > 0 ? newCardActions[cardNum] : null
}

function render() {
  ReactDOM.render(
    React.createElement(App, {
      cards: bank.getReduxStoreState(),
      newCardAction: chooseRandomCard(
        bank.syncedState.actions.concat(bank.unsyncedState.actions)),
      speakUrlPrefix: 'https://serverdts.localtunnel.me/speak/',
      addCard: (card: Card) => {
        bank.addActionAddCard(card)
        render()
      },
      addExposure: (exposure: Exposure) => {
        bank.addActionAddExposure(exposure)
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

//document.addEventListener('DOMContentLoaded', ()=>{
  render()
//})
window.alert('loaded index.js')
