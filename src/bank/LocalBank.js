import type { Action }          from './Action'
import type { BankApi }         from './api/BankApi'
import type { BankApiRequest }  from './api/BankApiRequest'
import type { BankApiResponse } from './api/BankApiResponse'
import type { Card }            from '../Card'
import type { LocalStorage }    from '../LocalStorage'
import type { Store }           from 'redux'
import type { Exposure }        from '../Exposure'
import type { AppState }        from '../AppState'
import { createStore }          from 'redux'
import reducer                  from './reducer'
import SyncedState              from './SyncedState'
import UnsyncedState            from './UnsyncedState'
import Heap                     from 'heap'

export default class LocalBank {
  bankApi:       BankApi
  syncedState:   SyncedState
  unsyncedState: UnsyncedState
  reduxStore:    Store<AppState, Action>

  constructor(bankApi: BankApi, localStorage: LocalStorage) {
    this.bankApi       = bankApi
    this.syncedState   = new SyncedState(localStorage)
    this.unsyncedState = new UnsyncedState(localStorage)
  }

  initFromLocalStorage() {
    this.syncedState.initFromLocalStorage()
    this.unsyncedState.initFromLocalStorage()

    const cardByCardId: {[cardId: number]: Card} = {}
    const comparer = (cardId1: number, cardId2: number) => {
      // sort cards with hadFastBlink=true to the end
      const _1 = (cardByCardId[cardId1].hadFastBlink ? 1 : 0) -
                 (cardByCardId[cardId2].hadFastBlink ? 1 : 0)
      if (_1 !== 0) return _1

      // sort newer cards (don't have fast nods) to the beginning
      const _2 = (cardByCardId[cardId1].numFastNods || 0) -
                 (cardByCardId[cardId2].numFastNods || 0)
      if (_2 !== 0) return _2

      return 0
    }
    this.reduxStore = createStore(reducer, {
      cardByCardId,
      fastHeap: new Heap(comparer),
      slowHeap: new Heap(comparer)
    })
    const actions = this.syncedState.actions.concat(this.unsyncedState.actions)
    for (const action of actions) {
      this.reduxStore.dispatch(action)
    }
  }

  getReduxStoreState(): AppState {
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

    const actionIdsToIgnore: {[actionId: number]: boolean} =
      this.unsyncedState.handleSyncResponse(response, this.syncedState.clientId)

    for (const action of newActions) {
      if (!actionIdsToIgnore[action.actionId]) {
        this.reduxStore.dispatch(action)
      }
    }
  }

  addNoopAction() {
    const action = this.unsyncedState.addAction({ type: 'NOOP' })
    this.reduxStore.dispatch(action)
  }

  addAddCardAction(card: Card) {
    const action = this.unsyncedState.addAction({ type: 'ADD_CARD', card })
    this.reduxStore.dispatch(action)
  }

  addUpdateCardAction(card: Card) {
    const action = this.unsyncedState.addAction({ type: 'UPDATE_CARD', card })
    this.reduxStore.dispatch(action)
  }

  addActionAddExposure(exposure: Exposure) {
    const action = this.unsyncedState.addAction(
      { type: 'ADD_EXPOSURE', exposure })
    this.reduxStore.dispatch(action)
  }
}
