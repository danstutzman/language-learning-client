import {main} from './exp/main'

document.addEventListener('DOMContentLoaded', ()=> {
  (document.getElementById('mount'):any).innerHTML =
    '<pre>' + main() + '</pre>'
})

/*
import type { Exposure }   from './Exposure'
import type { CardUpdate } from './CardUpdate'
import type { CardAdd }    from './CardAdd'
import Ajax                from './Ajax'
import AjaxBankApi         from './bank/api/AjaxBankApi'
import App                 from './components/App'
import LocalBank           from './bank/LocalBank'
import React               from 'react'
import ReactDOM            from 'react-dom'
import { SYNCED_KEY, UNSYNCED_KEY } from './LocalStorage'

const SERVER_URL_ROOT = 'http://localhost:3000'

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
    exposures:    []
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

function playEs(es: string): Promise<void> {
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
  return new Promise((resolve, reject) => {
    esToPromiseBuffer[es].then(blob => {
      const success = buffer => {
        const source = context.createBufferSource()
        source.buffer = buffer
        source.connect(context.destination)
        source.onended = ()=>{
          resolve()
        }
        source.start(0)
      }
      const error = e => {
        reject(new Error(`Error decoding audio data: ${e && e.err}`))
      }

      let fileReader = new FileReader()
      fileReader.onloadend = ()=>{
        const arrayBuffer: ArrayBuffer = (fileReader.result: any)
        context.decodeAudioData(arrayBuffer, success, error)
      }
      fileReader.readAsArrayBuffer(blob)
    }).catch(e => {
      reject(e)
    })
  })
}

function render() {
  ReactDOM.render(
    React.createElement(App, {
      appState: bank.getReduxStoreState(),
      saveCardAdd: (add: CardAdd) => {
        bank.addAddCardAction(add)
        render()
      },
      saveCardUpdate: (cardId: number, update: CardUpdate) => {
        bank.addUpdateCardAction(cardId, update)
        render()
      },
      addExposure: (exposure: Exposure) => {
        bank.addExposure(exposure)
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
    }),
    document.getElementById('mount'))
}

//document.addEventListener('DOMContentLoaded', ()=>{
  render()
//})
*/
