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
import CardList                 from '../CardList'
import { assertNum }            from '../assertType'

const DAYS = 24 * 60 * 60 * 1000
const NUM_FAST_NODS_TO_TIME_THRESHOLD = [0,
  1 * DAYS // 1 fast nod
]

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

    const fastFilter = (card) => {
      if (card.hadFastBlink) return false
      if (card.lastFastNod) {
        const threshold =
          NUM_FAST_NODS_TO_TIME_THRESHOLD[card.numFastNods || 0] || 2 * DAYS
        if (new Date().getTime() - assertNum(card.lastFastNod) < threshold) {
          return false
        }
      }
      return true
    }

    const noFilter = () => { return true }

    const compare = (c1: Card, c2: Card) => {
      // sort newer cards (don't have fast nods) to the beginning
      const _1 = (c1.numFastNods || 0) - (c2.numFastNods || 0)
      if (_1 !== 0) return _1

      return 0
    }

    const cardByCardId: {[cardId: number]: Card} = {}
    this.reduxStore = createStore(reducer, {
      cardByCardId,
      fastCards: new CardList(cardByCardId, fastFilter, compare),
      slowCards: new CardList(cardByCardId, noFilter, compare)
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
