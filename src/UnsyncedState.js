import type { Action } from './Action'
import type { BankApi } from './BankApi'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'
import type { LocalStorage } from './LocalStorage'
import { UNSYNCED_KEY } from './LocalStorage'
import { assertArrayAction } from './Action'
import { assertNum, assertObj } from './assertType'
import SyncedState from './SyncedState'

export default class UnsyncedState {
  localStorage: LocalStorage
  unsyncedActions: Array<Action>
  nextActionId: number // for this clientId

  constructor(localStorage: LocalStorage) {
    this.localStorage = localStorage
  }
  
  initFromLocalStorage() {
    const storedDataUnsynced = this.localStorage.getItem(UNSYNCED_KEY)
    if (storedDataUnsynced === null){
      throw new Error(
        `Expected initialized LocalStorage ${UNSYNCED_KEY}`)
    } else {
      const unjsoned: {} = assertObj(JSON.parse(storedDataUnsynced))

      if (unjsoned.unsyncedActions === undefined) {
        throw new Error("No unsyncedActions")
      }
      this.unsyncedActions = assertArrayAction(unjsoned.unsyncedActions)

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
    let newUnsyncedActions = []
    for (const action of this.unsyncedActions) {
      if (actionIdsToDelete[action.actionId] !== true) {
        newUnsyncedActions.push(action)
      }
    }
    this.unsyncedActions = newUnsyncedActions
    this._saveUnsynced()
  }

  addAction(): Action {
    const action = {
      type: 'ADD_CARD',
      actionId: this.nextActionId
    }
    this.unsyncedActions.push(action)
    this.nextActionId += 10
    this._saveUnsynced()
    return action
  }

  _saveUnsynced() {
    this.localStorage.setItem(UNSYNCED_KEY, JSON.stringify({
      unsyncedActions: this.unsyncedActions,
      nextActionId:    this.nextActionId
    }))
  }
}
