import type { Action } from '../Action'

export default function(cards: {[actionId: number]: boolean}, action: Action) {
  console.log('action', action)
  switch (action.type) {
    case '@@redux/INIT':
      break // Ignore
    case 'ADD_CARD':
      cards[action.actionId] = true
      break
    default:
      throw new Error(`Unknown action.type ${action.type}`)
  }
  console.log('cards', cards)
  return cards
}
