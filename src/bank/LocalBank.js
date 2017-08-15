import type { Action }          from './Action'
import type { BankApi }         from './api/BankApi'
import type { BankApiRequest }  from './api/BankApiRequest'
import type { BankApiResponse } from './api/BankApiResponse'
import type { Card }            from '../Card'
import type { LocalStorage }    from '../LocalStorage'
import type { Store }           from 'redux'
import type { Exposure }        from '../Exposure'
import { createStore }          from 'redux'
import reducer                  from './reducer'
import SyncedState              from './SyncedState'
import UnsyncedState            from './UnsyncedState'

export default class LocalBank {
  bankApi:       BankApi
  syncedState:   SyncedState
  unsyncedState: UnsyncedState
  reduxStore:    Store<{[actionId: number]: Card}, Action>

  constructor(bankApi: BankApi, localStorage: LocalStorage) {
    this.bankApi       = bankApi
    this.syncedState   = new SyncedState(localStorage)
    this.unsyncedState = new UnsyncedState(localStorage)
  }

  initFromLocalStorage() {
    this.syncedState.initFromLocalStorage()
    this.unsyncedState.initFromLocalStorage()

    this.reduxStore = createStore(reducer, {})
    const actions = this.syncedState.actions.concat(this.unsyncedState.actions)
    for (const action of actions) {
      this.reduxStore.dispatch(action)
    }
  }

  getReduxStoreState() {
    return this.reduxStore.getState()
  }

  sync(): Promise<void> {
    const request: BankApiRequest = {
      clientId:                    this.syncedState.clientId,
      clientIdToMaxSyncedActionId: this.syncedState.clientIdToMaxSyncedActionId,
      actionsFromClient:           this.unsyncedState.actions
    }
    console.log(`Sync request: ${JSON.stringify(request)}`)

    return this.bankApi.sync(request)
      .then(this._handleSyncResponse.bind(this))
  }

  _handleSyncResponse(response: BankApiResponse) {
    console.log(`Sync response: ${JSON.stringify(response)}`)

    const newActions = this.syncedState.handleSyncResponse(response)
    for (const action of newActions) {
      this.reduxStore.dispatch(action)
    }

    this.unsyncedState.handleSyncResponse(response, this.syncedState.clientId)
  }

  addNoopAction() {
    const action = this.unsyncedState.addAction(
        'NOOP', undefined, undefined)
    this.reduxStore.dispatch(action)
  }

  addActionAddCard(card: Card) {
    const action = this.unsyncedState.addAction(
        'ADD_CARD', card, undefined)
    this.reduxStore.dispatch(action)
  }

  addActionAddExposure(exposure: Exposure) {
    const action = this.unsyncedState.addAction('ADD_EXPOSURE',
        undefined, exposure)
    this.reduxStore.dispatch(action)
  }
}
