import type { LocalStorage } from '../LocalStorage'
import type { Action } from '../Action'
import { BankApiResponse } from './api/BankApiResponse'
import { assertNum, assertObj, assertObjNum } from '../assertType'
import { assertArrayAction } from '../Action'
import { SYNCED_KEY } from '../LocalStorage'

export default class SyncedState {
  localStorage: LocalStorage
  clientId: number
  actions: Array<Action>
  clientIdToMaxSyncedActionId: {[clientId: string]: number}

  constructor(localStorage: LocalStorage) {
    this.localStorage = localStorage
  }

  initFromLocalStorage() {
    const storedDataSynced = this.localStorage.getItem(SYNCED_KEY)
    if (storedDataSynced === null){
      throw new Error(`Expected initialized LocalStorage ${SYNCED_KEY}`)
    } else {
      const unjsoned: {} = assertObj(JSON.parse(storedDataSynced))

      if (unjsoned.clientId === undefined) {
        throw new Error("No clientId")
      }
      this.clientId = assertNum(unjsoned.clientId)

      if (unjsoned.actions === undefined) {
        throw new Error("No actions")
      }
      this.actions = assertArrayAction(unjsoned.actions)

      if (unjsoned.clientIdToMaxSyncedActionId === undefined) {
        throw new Error("No clientIdToMaxSyncedActionId")
      }
      this.clientIdToMaxSyncedActionId =
        assertObjNum(unjsoned.clientIdToMaxSyncedActionId)
    }
  }

  handleSyncResponse(response: BankApiResponse) {
    const newActions = []
    for (const action of response.actionsToClient) {
      this.actions.push(action)
      newActions.push(action)

      const clientId = action.actionId % 10
      const existing: number =
        this.clientIdToMaxSyncedActionId[clientId.toString()] || 0
      if (action.actionId > existing) {
        this.clientIdToMaxSyncedActionId[clientId.toString()] = action.actionId
      }
    }

    this._saveSynced()

    return newActions
  }

  _saveSynced() {
    this.localStorage.setItem(SYNCED_KEY, JSON.stringify({
      clientId:                    this.clientId,
      actions:                     this.actions,
      clientIdToMaxSyncedActionId: this.clientIdToMaxSyncedActionId
    }))
  }
}
