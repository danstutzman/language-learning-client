import type { Card }     from './Card'
import type { Exposure } from './Exposure'
import type { AddCardAction } from './bank/Action'
import Ajax              from './Ajax'
import AjaxBankApi       from './bank/api/AjaxBankApi'
import App               from './App'
import LocalBank         from './bank/LocalBank'
import React             from 'react'
import ReactDOM          from 'react-dom'
import { SYNCED_KEY, UNSYNCED_KEY } from '../src/LocalStorage'
import { assertAddCardAction } from './bank/Action'

const SERVER_URL_ROOT = 'https://serverdts.localtunnel.me'

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
  new AjaxBankApi(new Ajax(), `${SERVER_URL_ROOT}/api/sync`),
  window.localStorage)
bank.initFromLocalStorage()

function initAudioContext(): AudioContext {
  // See http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api#32840804
  // If still no sound, check if hardware ringer switch is on vibrate-only
  if (window.myAudioContext === undefined) {
    if (window.AudioContext) {
      window.myAudioContext = new window.AudioContext()
    } else if (window.webkitAudioContext) {
      window.myAudioContext = new window.webkitAudioContext()
    } else {
      window.alert('Your browser does not support yet Web Audio API')
    }
  }
  return window.myAudioContext
}

function playTestSound() {
  const context = initAudioContext()
  const oscillator = context.createOscillator()
  oscillator.frequency.value = 400
  oscillator.connect(context.destination)
  oscillator.start(context.currentTime)
  oscillator.stop(context.currentTime + 1.0)
}

const esToPromiseBuffer: {[es: string]: Promise<Blob>} = {}

function playEs(es: string) {
  const context = initAudioContext()
  const audioUrl = `${SERVER_URL_ROOT}/speak/${es}.mp3`

  if (esToPromiseBuffer[es] === undefined) {
    esToPromiseBuffer[es] = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', audioUrl, true)
      xhr.responseType = 'arraybuffer'
      xhr.onreadystatechange = ()=>{
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const blob = new Blob([xhr.response], {type: 'audio/mpeg'})
            resolve(blob)
          } else {
            reject(`Got ${xhr.status} from ${audioUrl}`)
          }
        }
      }
      xhr.send()
    })
  }
  esToPromiseBuffer[es].then(blob => {
    const success = buffer => {
      const source = context.createBufferSource()
      source.buffer = buffer
      source.connect(context.destination)
      source.start(0)
    }
    const error = e => {
      throw new Error(`Error decoding audio data: ${e && e.err}`)
    }

    let fileReader = new FileReader()
    fileReader.onloadend = ()=>{
      const arrayBuffer: ArrayBuffer = (fileReader.result: any)
      context.decodeAudioData(arrayBuffer, success, error)
    }
    fileReader.readAsArrayBuffer(blob)
  }).catch(e => {
    throw new Error(e)
  })
}

const allActions = bank.syncedState.actions.concat(bank.unsyncedState.actions)
const newCardActions: Array<AddCardAction> = allActions.filter(action => {
  return action.type === 'ADD_CARD' &&
    action.card.es && action.card.en && action.card.gender
}).map(assertAddCardAction)
//let currentCardNum = Math.floor(Math.random() * newCardActions.length)
let currentCardNum = 0

function render() {
  ReactDOM.render(
    React.createElement(App, {
      cards: bank.getReduxStoreState(),
      newCardAction: newCardActions[currentCardNum],
      saveCardEdit: (cardId: number, card: Card) => {
        if (cardId === -1) {
          bank.addAddCardAction(card)
        } else {
          bank.addUpdateCardAction(card, cardId)
        }
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
      },
      playEs:    playEs,
      playSound: playTestSound,
      nextCard: ()=>{
        currentCardNum += 1
        render()
      }
    }),
    document.getElementById('mount'))
}

//document.addEventListener('DOMContentLoaded', ()=>{
  render()
//})
