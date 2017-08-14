import type { Action } from './Action'
import type { Card } from '../Card'

export default function(cards: {[actionId: number]: Card}, action: Action) {
  console.log('action', action)
  switch (action.type) {
    case '@@redux/INIT':
      break // Ignore
    case 'NOOP':
      break // Ignore
    case 'ADD_CARD':
      if (action.card === undefined) {
        throw new Error(`Undefined card field for actionId=${action.actionId}`)
      }
      cards[action.actionId] = action.card
      break
    default:
      throw new Error(`Unknown action.type ${action.type}`)
  }
  console.log('cards', cards)
  return cards
}
