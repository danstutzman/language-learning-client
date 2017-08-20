import type { Action }          from './Action'
import type { BankApi }         from './api/BankApi'
import type { BankApiRequest }  from './api/BankApiRequest'
import type { BankApiResponse } from './api/BankApiResponse'
import type { Card }            from '../Card'
import type { LocalStorage }    from '../LocalStorage'
import type { Store }           from 'redux'
import type { Exposure }        from '../Exposure'
import type { AppState }        from '../AppState'
import type { CardAdd }         from '../CardAdd'
import type { CardUpdate }      from '../CardUpdate'
import { createStore }          from 'redux'
import reducer                  from './reducer'
import SyncedState              from './SyncedState'
import UnsyncedState            from './UnsyncedState'
import CardList                 from '../CardList'

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
      if (card.suspended) return false
      // TODO
      return true
    }
    const slowFilter = (card) => {
      if (card.suspended) return false
      // TODO
      return true
    }

    const compare = (c1: Card, c2: Card) => { // eslint-disable-line no-unused-vars
      // TODO
      return 0
    }

    const cardByCardId: {[cardId: number]: Card} = {}
    this.reduxStore = createStore(reducer, {
      cardByCardId,
      fastCards:   new CardList(cardByCardId, fastFilter, compare),
      slowCards:   new CardList(cardByCardId, slowFilter, compare)
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
      actionsFromClient:           this.unsyncedState.actions,
      exposures:                   this.unsyncedState.exposures
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
    const action = this.unsyncedState.addNoopAction()
    this.reduxStore.dispatch(action)
  }

  addAddCardAction(newCard: CardUpdate) {
    const cardAdd: CardAdd = {
      type:      'EsN',
      gender:    newCard.gender    || '',
      es:        newCard.es        || '',
      en:        newCard.en        || '',
      mnemonic:  newCard.mnemonic  || ''
    }
    const action = this.unsyncedState.addAddCardAction(cardAdd)
    this.reduxStore.dispatch(action)
  }

  addUpdateCardAction(cardId: number, cardUpdate: CardUpdate) {
    const action = this.unsyncedState.addUpdateCardAction(cardId, cardUpdate)
    this.reduxStore.dispatch(action)
  }

  addExposure(exposure: Exposure) {
    this.unsyncedState.addExposure(exposure)
  }
}
