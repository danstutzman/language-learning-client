import type { Action } from './Action'
import type { BankApi } from './BankApi'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'
import type { LocalStorage } from './LocalStorage'
import SyncedState from './SyncedState'
import UnsyncedState from './UnsyncedState'

export default class LocalBank {
  bankApi: BankApi
  localStorage: LocalStorage
  syncedState: SyncedState
  unsyncedState: UnsyncedState

  constructor(bankApi: BankApi, localStorage: LocalStorage) {
    this.bankApi = bankApi
    this.localStorage = localStorage
    this.syncedState = new SyncedState(localStorage)
    this.unsyncedState = new UnsyncedState(localStorage)
  }

  initFromLocalStorage() {
    this.syncedState.initFromLocalStorage()
    this.unsyncedState.initFromLocalStorage()
  }

  sync(): Promise<Array<Action>> {
    const request: BankApiRequest = {
      clientId:                    this.syncedState.clientId,
      clientIdToMaxSyncedActionId: this.syncedState.clientIdToMaxSyncedActionId,
      actionsFromClient:           this.unsyncedState.unsyncedActions
    }
    console.log(`Sync request: ${JSON.stringify(request)}`)

    return this.bankApi.sync(request)
      .then(this._handleSyncResponse.bind(this))
  }

  _handleSyncResponse(response: BankApiResponse): Array<Action> {
    console.log(`Sync response: ${JSON.stringify(response)}`)
    const newActions = this.syncedState.handleSyncResponse(response)
    this.unsyncedState.handleSyncResponse(response, this.syncedState.clientId)
    return newActions
  }

  addAction(): Action {
    return this.unsyncedState.addAction()
  }
}
