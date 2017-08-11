// @flow
import type { Action } from './Action'
import type { BankApi } from './BankApi'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'

class LocalBank {
  bankApi: BankApi
  clientId: number
  syncedActions: Array<Action>
  unsyncedActions: Array<Action>
  nextActionId: number // for this clientId
  clientIdToMaxSyncedActionId: Map<number, number>

  constructor(bankApi: BankApi, clientId: number) {
    // clientId must fit in last digit of actionIds
    if (clientId < 0 || clientId >= 10) {
      throw new Error(`Invalid clientId ${clientId}`)
    }

    this.bankApi = bankApi
    this.clientId = clientId
    this.syncedActions = []
    this.unsyncedActions = []
    // Start numbering at 1, but multiply by ten to put clientId in last digit
    this.nextActionId = 10 + clientId
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

    for (const action of response.actionsToClient) {
      this.syncedActions.push(action)
      
      const clientId = action.actionId % 10
      const existing: number = this.clientIdToMaxSyncedActionId.get(clientId) || 0
      if (action.actionId > existing) {
        this.clientIdToMaxSyncedActionId.set(clientId, action.actionId)
      }
    }

    let actionIdsToDelete = {}
    for (const action of response.actionsToClient) {
      if (action.actionId % 10 === this.clientId) {
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
      actionId: this.nextActionId
    })
    this.nextActionId += 10
  }
}

module.exports = LocalBank
