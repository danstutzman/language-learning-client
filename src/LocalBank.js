import type { Action } from './Action'
import type { BankApi } from './BankApi'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'
import type { LocalStorage } from './LocalStorage'

const { SYNCED_KEY, UNSYNCED_KEY } = require('./LocalStorage')

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
  clientIdToMaxSyncedActionId: Map<number, number>

  constructor(bankApi: BankApi, localStorage: LocalStorage) {
    this.bankApi = bankApi
    this.localStorage = localStorage

    const storedDataSynced = this.localStorage.getItem(SYNCED_KEY)
    if (storedDataSynced === null){
      throw new Error(`Expected initialized LocalStorage ${SYNCED_KEY}`)
    } else {
      const unjsoned = JSON.parse(storedDataSynced)
      this.clientId        = nonNull(unjsoned.clientId)
      this.syncedActions   = nonNull(unjsoned.syncedActions)
      this.clientIdToMaxSyncedActionId =
        this._objectToMapNumNum(nonNull(unjsoned.clientIdToMaxSyncedActionId))
    }

    const storedDataUnsynced = this.localStorage.getItem(UNSYNCED_KEY)
    if (storedDataUnsynced === null){
      throw new Error(
        `Expected initialized LocalStorage ${UNSYNCED_KEY}`)
    } else {
      const unjsoned = JSON.parse(storedDataUnsynced)
      this.unsyncedActions = nonNull(unjsoned.unsyncedActions)
      this.nextActionId    = nonNull(unjsoned.nextActionId)
    }
  }

  sync(): Promise<void> {
    const request: BankApiRequest = {
      clientId:                    this.clientId,
      clientIdToMaxSyncedActionId: this.clientIdToMaxSyncedActionId,
      actionsFromClient:           this.unsyncedActions
    }
    console.log(`Sync request: ${JSON.stringify(request)}`)

    return this.bankApi.sync(request)
      .then(this._handleSyncResponse.bind(this))
  }

  _handleSyncResponse(response: BankApiResponse) {
    console.log(`Sync response: ${JSON.stringify(response)}`)
    nonNull(response.actionsToClient)

    for (const action of response.actionsToClient) {
      this.syncedActions.push(action)
      
      const clientId = action.actionId % 10
      const existing: number =
        this.clientIdToMaxSyncedActionId.get(clientId) || 0
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
    this._saveUnsynced()
  }

  _saveSynced() {
    this.localStorage.setItem(SYNCED_KEY, JSON.stringify({
      clientId:       nonNull(this.clientId),
      syncedActions:  nonNull(this.syncedActions),
      clientIdToMaxSyncedActionId:
        this._mapNumNumToObject(nonNull(this.clientIdToMaxSyncedActionId))
    }))
  }

  _saveUnsynced() {
    this.localStorage.setItem(UNSYNCED_KEY, JSON.stringify({
      unsyncedActions: nonNull(this.unsyncedActions),
      nextActionId:    nonNull(this.nextActionId)
    }))
  }

  _objectToMapNumNum(object: {[key: string]: number}): Map<number, number> {
    const map: Map<number, number> = new Map()
    for (const key of Object.keys(object)) {
      const value = object[key]
      if (typeof(value) === 'number') {
        map.set(parseInt(key), value)
      } else {
        throw new Error(
            `Unexpected non-number value in object ${JSON.stringify(object)}`)
      }
    }
    return map
  }

  _mapNumNumToObject(map: Map<number, number>): {[key: string]: number} {
    const object: {[key: string]: number} = {}
    for (const [key, value] of map.entries()) {
      object[key.toString()] = value
    }
    return map
  }
}

module.exports = LocalBank
