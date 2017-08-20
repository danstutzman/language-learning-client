import type { Action } from './Action'
import type { AppState } from '../AppState'
import { assertCard, STAGE0_MISSING_FIELDS, STAGE1_COMPLETE_FIELDS
  } from '../Card'
import { assertAddCardAction, assertUpdateCardAction } from './Action'

function addCard(appState: AppState, action: Action) {
  const add = assertAddCardAction(action)
  const { gender, es, en } = add.cardAdd
  const card = assertCard(Object.assign({
    cardId: action.actionId,
    suspended: false,
    stageNum: (gender === '' || es === '' || en === '') ?
      STAGE0_MISSING_FIELDS : STAGE1_COMPLETE_FIELDS
  }, (add.cardAdd: any)))

  appState.cardByCardId[action.actionId] = card
  appState.listenCards.update()
  appState.speakCards.update()
}

function updateCard(appState: AppState, action: Action) {
  const update = assertUpdateCardAction(action)
  const card = appState.cardByCardId[update.cardId]
  Object.assign(card, update.cardUpdate, { lastSeenAt: action.createdAtMillis })
  appState.listenCards.update()
  appState.speakCards.update()
}

export default function(appState: AppState, action: Action) {
  switch (action.type) {
    case '@@redux/INIT': break // Ignore
    case 'NOOP':         break // Ignore
    case 'ADD_CARD':     addCard(appState, action); break
    case 'UPDATE_CARD':  updateCard(appState, action); break
    default: throw new Error(`Unknown action.type ${action.type}`)
  }
  return appState
}
