// @flow
import type { Action } from './Action'

const { nonNullNumber } = require('./assertType')

class FakeBankApi {
  nextClientId: number
  actions: Array<Action>

  constructor() {
    this.nextClientId = 1
    this.actions = []
  }
  sync(clientId: number | null,
      clientIdToMaxSyncedActionId: Map<number, number>,
      actionsFromClient: Array<Action>) {
    if (clientId === null) {
      clientId = this.nextClientId
      this.nextClientId += 1
    }

    for (const action of actionsFromClient) {
      if (action.clientId === null) {
        action.clientId = clientId
      }
      this.actions.push(action)
    }

    let actionsToClient = []
    for (const action of this.actions) {
      if (action.actionId >
          (clientIdToMaxSyncedActionId.get(nonNullNumber(action.clientId)) || 0)) {
        actionsToClient.push(action)
      }
    }

    return { clientId, actionsToClient }
  }
}

module.exports = FakeBankApi
