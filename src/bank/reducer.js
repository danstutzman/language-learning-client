import type { Action } from './Action'
import type { AppState } from '../AppState'
import { assertAddCardAction, assertUpdateCardAction } from './Action'
import { assertExposure } from '../Exposure'

export default function(appState: AppState, action: Action) {
  let card
  switch (action.type) {
    case '@@redux/INIT':
      break // Ignore
    case 'NOOP':
      break // Ignore
    case 'ADD_CARD':
      var add = assertAddCardAction(action)
      appState.cardByCardId[add.card.cardId] = add.card
      appState.fastHeap.push(add.card.cardId)
      appState.slowHeap.push(add.card.cardId)
      break
    case 'UPDATE_CARD':
      var update = assertUpdateCardAction(action)
      card = appState.cardByCardId[update.card.cardId]
      appState.cardByCardId[update.card.cardId] =
        Object.assign({}, card, update.card)
      appState.fastHeap.updateItem(card.cardId)
      appState.slowHeap.updateItem(card.cardId)
      break
    case 'ADD_EXPOSURE':
      var exposure = assertExposure(action.exposure)
      card = appState.cardByCardId[exposure.cardId]
      switch (exposure.type) {
        case 'FAST_NOD':
          appState.cardByCardId[exposure.cardId] = Object.assign({}, card,
            { numFastNods: (card.numFastNods || 0) + 1 })
          break
        case 'FAST_BLINK':
          appState.cardByCardId[exposure.cardId] = Object.assign({}, card,
            { hadFastBlink: true })
          break
        case 'SLOW_NOD':
          break
      }
      appState.fastHeap.updateItem(card.cardId)
      appState.slowHeap.updateItem(card.cardId)
      break
    default:
      throw new Error(`Unknown action.type ${action.type}`)
  }
  return appState
}
