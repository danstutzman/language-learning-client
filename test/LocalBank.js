// @flow
import type { Action } from './Action'
import type { BankApi } from './BankApi'
import type { BankApiResult } from './BankApiResult'

class LocalBank {
  bankApi: BankApi
  clientId: number | null // null means unassigned
  syncedActions: Array<Action>
  unsyncedActions: Array<Action>
  nextActionId: number // for this clientId

  constructor(bankApi: BankApi) {
    this.bankApi = bankApi
    this.clientId = null
    this.syncedActions = []
    this.unsyncedActions = []
    this.nextActionId = 1
  }
  sync() {
    const request = {
      clientId:          this.clientId,
      actionsFromClient: this.unsyncedActions
    }
    console.log(`Sync request: ${JSON.stringify(request)}`)

    const response: BankApiResult = this.bankApi.sync(
        request.clientId, request.actionsFromClient)
    console.log(`From sync ${JSON.stringify(response)}`)

    if (response.clientId === null) {
      throw new Error("Expected to be assigned a clientId")
    }
    if (this.clientId === null) {
      this.clientId = response.clientId
    } else if (response.clientId !== this.clientId) {
      throw new Error(`Had clientId ${this.clientId}
          but reassigned ${response.clientId}`)
    }

    for (const action of response.actionsToClient) {
      this.syncedActions.push(action)
    }

    let actionIdsToDelete = {}
    for (const action of response.actionsToClient) {
      if (action.clientId === this.clientId) {
        actionIdsToDelete[action.actionId] = true
      }
    }
    let newUnsyncedActions = []
    for (const action of this.unsyncedActions) {
      if (!actionIdsToDelete[action.actionId]) {
        newUnsyncedActions.push(action)
      }
    }
    this.unsyncedActions = newUnsyncedActions
  }
  addAction() {
    this.unsyncedActions.push({
      clientId: this.clientId,
      actionId: this.nextActionId
    })
    this.nextActionId += 1
  }
}

module.exports = LocalBank
