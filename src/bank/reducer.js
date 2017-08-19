import type { Action } from './Action'
import type { AppState } from '../AppState'
import { assertAddCardAction, assertUpdateCardAction } from './Action'

export default function(appState: AppState, action: Action) {
  let card
  switch (action.type) {
    case '@@redux/INIT':
      break // Ignore
    case 'NOOP':
      break // Ignore
    case 'ADD_CARD':
      var add = assertAddCardAction(action)
      appState.cardByCardId[action.actionId] =
        Object.assign({ cardId: action.actionId }, (add.cardAdd: any))
      appState.fastCards.update()
      appState.slowCards.update()
      break
    case 'UPDATE_CARD':
      var update = assertUpdateCardAction(action)
      card = appState.cardByCardId[update.cardId]
      Object.assign({}, card, update.cardUpdate)
      appState.fastCards.update()
      appState.slowCards.update()
      break
    default:
      throw new Error(`Unknown action.type ${action.type}`)
  }
  return appState
}
