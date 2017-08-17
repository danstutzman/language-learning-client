import type { Action, NoopAction, AddCardAction, AddExposureAction
  } from './Action'
import type { BankApiResponse } from './api/BankApiResponse'
import type { LocalStorage } from '../LocalStorage'
import type { Card } from '../Card'
import type { Exposure } from '../Exposure'
import { UNSYNCED_KEY } from '../LocalStorage'
import { assertArrayAction } from './Action'
import { assertNum, assertObj } from '../assertType'

export default class UnsyncedState {
  localStorage: LocalStorage
  actions:      Array<Action>
  nextActionId: number // for this clientId

  constructor(localStorage: LocalStorage) {
    this.localStorage = localStorage
  }

  initFromLocalStorage() {
    const storedDataUnsynced = this.localStorage.getItem(UNSYNCED_KEY)
    if (storedDataUnsynced === null) {
      throw new Error(
        `Expected initialized LocalStorage ${UNSYNCED_KEY}`)
    } else {
      const unjsoned: {} = assertObj(JSON.parse(storedDataUnsynced))

      if (unjsoned.actions === undefined) {
        throw new Error("No actions")
      }
      this.actions = assertArrayAction(unjsoned.actions)

      if (unjsoned.nextActionId === undefined) {
        throw new Error("No nextActionId")
      }
      this.nextActionId = assertNum(unjsoned.nextActionId)
    }
  }

  handleSyncResponse(response: BankApiResponse, clientId: number) {
    let actionIdsToDelete = {}
    for (const action of response.actionsToClient) {
      if (action.actionId % 10 === clientId) {
        actionIdsToDelete[action.actionId] = true
      }
    }
    let newActions = []
    for (const action of this.actions) {
      if (actionIdsToDelete[action.actionId] !== true) {
        newActions.push(action)
      }
    }
    this.actions = newActions
    this._saveUnsynced()
  }

  addAddCardAction(card: Card): AddCardAction {
    const actionId = this.nextActionId
    const createdAtMillis = new Date().getTime()
    const action = { type: 'ADD_CARD', actionId, createdAtMillis, card }
    this.actions.push(action)
    this.nextActionId += 10
    this._saveUnsynced()
    return action
  }

  addAddExposureAction(exposure: Exposure): AddExposureAction {
    const actionId = this.nextActionId
    const createdAtMillis = new Date().getTime()
    const action = { type: 'ADD_EXPOSURE', actionId, createdAtMillis, exposure }
    this.actions.push(action)
    this.nextActionId += 10
    this._saveUnsynced()
    return action
  }

  addNoopAction(): NoopAction {
    const actionId = this.nextActionId
    const createdAtMillis = new Date().getTime()
    const action = { type: 'NOOP', actionId, createdAtMillis }
    this.actions.push(action)
    this.nextActionId += 10
    this._saveUnsynced()
    return action
  }

  _saveUnsynced() {
    this.localStorage.setItem(UNSYNCED_KEY, JSON.stringify({
      actions:      this.actions,
      nextActionId: this.nextActionId
    }))
  }
}
