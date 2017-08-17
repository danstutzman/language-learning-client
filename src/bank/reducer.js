import type { Action } from './Action'
import type { Card } from '../Card'
import { assertAddCardAction } from './Action'

export default function(cards: {[actionId: number]: Card}, action: Action) {
  console.log('action', action)
  switch (action.type) {
    case '@@redux/INIT':
      break // Ignore
    case 'NOOP':
      break // Ignore
    case 'ADD_CARD':
      var action2 = assertAddCardAction(action)
      cards[action2.actionId] = action2.card
      break
    case 'ADD_EXPOSURE':
      var exposure = action.exposure
      if (exposure === undefined) {
        throw new Error(`Undefined exposure for actionId=${action.actionId}`)
      }
      cards[exposure.cardId].remembered = exposure.remembered
      break
    default:
      throw new Error(`Unknown action.type ${action.type}`)
  }
  console.log('cards', cards)
  return cards
}
