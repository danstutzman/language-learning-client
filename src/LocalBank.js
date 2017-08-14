import type { Action } from './Action'
import type { BankApi } from './BankApi'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'
import type { LocalStorage } from './LocalStorage'
import { UNSYNCED_KEY } from './LocalStorage'
import { assertArrayAction } from './Action'
import { assertNum, assertObj } from './assertType'
import SyncedState from './SyncedState'

class LocalBank {
  bankApi: BankApi
  localStorage: LocalStorage
  syncedState: SyncedState
  unsyncedActions: Array<Action>
  nextActionId: number // for this clientId

  constructor(bankApi: BankApi, localStorage: LocalStorage) {
    this.bankApi = bankApi
    this.localStorage = localStorage
    this.syncedState = new SyncedState(localStorage)
  }

  initFromLocalStorage() {
    this.syncedState.initFromLocalStorage()

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

  sync(): Promise<Array<Action>> {
    const request: BankApiRequest = {
      clientId:                    this.syncedState.clientId,
      clientIdToMaxSyncedActionId: this.syncedState.clientIdToMaxSyncedActionId,
      actionsFromClient:           this.unsyncedActions
    }
    console.log(`Sync request: ${JSON.stringify(request)}`)

    return this.bankApi.sync(request)
      .then(this._handleSyncResponse.bind(this))
  }

  _handleSyncResponse(response: BankApiResponse): Array<Action> {
    console.log(`Sync response: ${JSON.stringify(response)}`)

    const newActions = this.syncedState.handleSyncResponse(response)

    let actionIdsToDelete = {}
    for (const action of response.actionsToClient) {
      if (action.actionId % 10 === this.syncedState.clientId) {
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

    return newActions
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

export default LocalBank
