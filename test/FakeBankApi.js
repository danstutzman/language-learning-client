// @flow
import type { Action } from './Action'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'

class FakeBankApi {
  actions: Array<Action>

  constructor() {
    this.actions = []
  }
  sync(request: BankApiRequest): BankApiResponse {
    for (const action of request.actionsFromClient) {
      this.actions.push(action)
    }

    let actionsToClient = []
    for (const action of this.actions) {
      const clientId = action.actionId % 10
      if (action.actionId >
          (request.clientIdToMaxSyncedActionId.get(clientId) || 0)) {
        actionsToClient.push(action)
      }
    }

    return { actionsToClient }
  }
}

module.exports = FakeBankApi
