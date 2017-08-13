import type { Action } from './Action'
import type { BankApi } from './BankApi'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'
import type { LocalStorage } from './LocalStorage'
import { SYNCED_KEY, UNSYNCED_KEY } from './LocalStorage'
import { assertArrayAction } from './Action'
import { assertNum, assertObj } from './assertType'

function nonNull(a: any): any {
  if (a === null) {
    throw new Error("Got unexpected null")
  } else if (a === undefined) {
    throw new Error("Got unexpected undefined")
  } else {
    return a
  }
}

class LocalBank {
  bankApi: BankApi
  localStorage: LocalStorage
  clientId: number
  syncedActions: Array<Action>
  unsyncedActions: Array<Action>
  nextActionId: number // for this clientId
  clientIdToMaxSyncedActionId: {[clientId: string]: number}

  constructor(bankApi: BankApi, localStorage: LocalStorage) {
    this.bankApi = bankApi
    this.localStorage = localStorage

    const storedDataSynced = this.localStorage.getItem(SYNCED_KEY)
    if (storedDataSynced === null){
      throw new Error(`Expected initialized LocalStorage ${SYNCED_KEY}`)
    } else {
      const unjsoned: {} = assertObj(JSON.parse(storedDataSynced))

      if (unjsoned.clientId === undefined) {
        throw new Error("No clientId")
      }
      this.clientId = assertNum(unjsoned.clientId)

      if (unjsoned.syncedActions === undefined) {
        throw new Error("No syncedActions")
      }
      this.syncedActions = assertArrayAction(unjsoned.syncedActions)

      if (unjsoned.clientIdToMaxSyncedActionId === undefined) {
        throw new Error("No clientIdToMaxSyncedActionId")
      }
      this.clientIdToMaxSyncedActionId =
        nonNull(unjsoned.clientIdToMaxSyncedActionId)
    }

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
      clientId:                    this.clientId,
      clientIdToMaxSyncedActionId: this.clientIdToMaxSyncedActionId,
      actionsFromClient:           this.unsyncedActions
    }
    console.log(`Sync request: ${JSON.stringify(request)}`)

    return this.bankApi.sync(request)
      .then(this._handleSyncResponse.bind(this))
  }

  _handleSyncResponse(response: BankApiResponse): Array<Action> {
    console.log(`Sync response: ${JSON.stringify(response)}`)
    nonNull(response.actionsToClient)

    const newActions = []
    for (const action of response.actionsToClient) {
      nonNull(action.actionId)
      nonNull(action.type)
      this.syncedActions.push(action)
      newActions.push(action)

      const clientId = action.actionId % 10
      const existing: number =
        this.clientIdToMaxSyncedActionId[clientId.toString()] || 0
      if (action.actionId > existing) {
        this.clientIdToMaxSyncedActionId[clientId.toString()] = action.actionId
      }
    }
    this._saveSynced()

    let actionIdsToDelete = {}
    for (const action of response.actionsToClient) {
      if (action.actionId % 10 === this.clientId) {
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

  _saveSynced() {
    this.localStorage.setItem(SYNCED_KEY, JSON.stringify({
      clientId:       nonNull(this.clientId),
      syncedActions:  nonNull(this.syncedActions),
      clientIdToMaxSyncedActionId: nonNull(this.clientIdToMaxSyncedActionId)
    }))
  }

  _saveUnsynced() {
    this.localStorage.setItem(UNSYNCED_KEY, JSON.stringify({
      unsyncedActions: nonNull(this.unsyncedActions),
      nextActionId:    nonNull(this.nextActionId)
    }))
  }
}

export default LocalBank
