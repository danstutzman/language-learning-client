import type { Action } from '../src/Action'
import type { BankApiRequest } from '../src/bank/api/BankApiRequest'
import type { BankApiResponse } from '../src/bank/api/BankApiResponse'

class FakeBankApi {
  actions: Array<Action>

  constructor() {
    this.actions = []
  }

  sync(request: BankApiRequest): Promise<BankApiResponse> {
    for (const action of request.actionsFromClient) {
      this.actions.push(action)
    }

    let actionsToClient = []
    for (const action of this.actions) {
      const clientId = action.actionId % 10
      if (action.actionId >
          (request.clientIdToMaxSyncedActionId[clientId.toString()] || 0)) {
        actionsToClient.push(action)
      }
    }

    return new Promise((resolve, reject) => {
      resolve({ actionsToClient })
    })
  }
}

module.exports = FakeBankApi
