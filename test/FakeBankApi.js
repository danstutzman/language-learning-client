// @flow
import type { Action } from './Action'

class FakeBankApi {
  nextClientId: number
  actions: Array<Action>

  constructor() {
    this.nextClientId = 1
    this.actions = []
  }
  sync(clientId: number | null, actionsFromClient: Array<Action>) {
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

    return {
      clientId: clientId,
      actionsToClient: this.actions
    }
  }
}

module.exports = FakeBankApi
