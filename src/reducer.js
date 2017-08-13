import type { Action } from './Action'

export default function(actions: Array<Action>, action: Action) {
  console.log('action', action)
  switch (action.type) {
    case '@@redux/INIT':
      break // Ignore
    case 'ADD_CARD':
      actions = actions.concat([action])
      break
    default:
      throw new Error(`Unknown action.type ${action.type}`)
  }
  console.log('actions', actions)
  return actions
}
