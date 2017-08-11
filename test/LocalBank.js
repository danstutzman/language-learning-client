// @flow
import type { Action } from './Action'
import type { BankApi } from './BankApi'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'

const { nonNullNumber } = require('./assertType')

class LocalBank {
  bankApi: BankApi
  clientId: number | null // null means unassigned
  syncedActions: Array<Action>
  unsyncedActions: Array<Action>
  nextActionId: number // for this clientId
  clientIdToMaxSyncedActionId: Map<number, number>

  constructor(bankApi: BankApi) {
    this.bankApi = bankApi
    this.clientId = null
    this.syncedActions = []
    this.unsyncedActions = []
    this.nextActionId = 1
    this.clientIdToMaxSyncedActionId = new Map()
  }
  sync() {
    const request: BankApiRequest = {
      clientId:                    this.clientId,
      clientIdToMaxSyncedActionId: this.clientIdToMaxSyncedActionId,
      actionsFromClient:           this.unsyncedActions
    }
    console.log(`Sync request: ${JSON.stringify(request)}`)

    const response: BankApiResponse = this.bankApi.sync(request)
    console.log(`Sync response: ${JSON.stringify(response)}`)

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
      const existing: number = this.clientIdToMaxSyncedActionId.get(
          nonNullNumber(action.clientId)) || 0
      if (action.actionId > existing) {
        this.clientIdToMaxSyncedActionId.set(nonNullNumber(action.clientId),
            action.actionId)
      }
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
