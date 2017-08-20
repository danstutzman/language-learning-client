import type { Action } from './Action'
import type { BankApiResponse } from './api/BankApiResponse'
import type { LocalStorage } from '../LocalStorage'
import type { Exposure } from '../Exposure'
import type { CardAdd } from '../CardAdd'
import type { CardUpdate } from '../CardUpdate'
import { UNSYNCED_KEY } from '../LocalStorage'
import { assertAction, assertArrayAction } from './Action'
import { assertNum, assertObj } from '../assertType'
import { assertCardAdd } from '../CardAdd'
import { assertCardUpdate } from '../CardUpdate'
import { assertExposure, assertArrayExposure } from '../Exposure'

export default class UnsyncedState {
  localStorage: LocalStorage
  actions:      Array<Action>
  nextActionId: number // for this clientId
  exposures:    Array<Exposure>

  constructor(localStorage: LocalStorage) {
    this.localStorage = localStorage
  }

  initFromLocalStorage() {
    const storedDataUnsynced = this.localStorage.getItem(UNSYNCED_KEY)
    if (storedDataUnsynced === null) {
      throw new Error(
        `Expected initialized LocalStorage ${UNSYNCED_KEY}`)
    } else {
      const unjsoned: {} = assertObj(JSON.parse(storedDataUnsynced))

      if (unjsoned.actions === undefined) {
        throw new Error("No actions")
      }
      this.actions = assertArrayAction(unjsoned.actions)

      if (unjsoned.nextActionId === undefined) {
        throw new Error("No nextActionId")
      }
      this.nextActionId = assertNum(unjsoned.nextActionId)

      if (unjsoned.exposures === undefined) {
        throw new Error("No exposures")
      }
      this.exposures = assertArrayExposure(unjsoned.exposures)
    }
  }

  handleSyncResponse(response: BankApiResponse, clientId: number):
      {[actionId: number]: boolean} {
    let actionIdsToDelete = {}
    for (const action of response.actionsToClient) {
      if (action.actionId % 10 === clientId) {
        actionIdsToDelete[action.actionId] = true
      }
    }

    let newActions = []
    let deletedActionIds = {}
    for (const action of this.actions) {
      if (actionIdsToDelete[action.actionId] !== true) {
        newActions.push(action)
      } else {
        deletedActionIds[action.actionId] = true
      }
    }
    this.actions = newActions

    // TODO might have added new exposures by time sync returns
    this.exposures = []

    this._saveUnsynced()
    return deletedActionIds
  }

  addNoopAction() {
    return this._addAction({type: 'NOOP'})
  }

  addAddCardAction(cardAdd: CardAdd) {
    assertCardAdd(cardAdd)
    return this._addAction({type: 'ADD_CARD', cardAdd })
  }

  addUpdateCardAction(cardId: number, cardUpdate: CardUpdate) {
    assertCardUpdate(cardUpdate)
    return this._addAction({type: 'UPDATE_CARD', cardId, cardUpdate })
  }

  _addAction(actionFields: {
      type: string,
      cardAdd?: CardAdd,
      cardUpdate?: CardUpdate
    }): Action {
    const actionId = this.nextActionId
    const createdAtMillis = new Date().getTime()
    const action =
      Object.assign(({ actionId, createdAtMillis }: any), actionFields)
    assertAction(action)
    this.actions.push(action)
    this.nextActionId += 10
    this._saveUnsynced()
    return action
  }

  addExposure(exposure: Exposure) {
    this.exposures.push(assertExposure(exposure))
    this._saveUnsynced()
  }

  _saveUnsynced() {
    this.localStorage.setItem(UNSYNCED_KEY, JSON.stringify({
      actions:      this.actions,
      nextActionId: this.nextActionId,
      exposures:    this.exposures
    }))
  }
}
