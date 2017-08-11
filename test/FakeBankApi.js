// @flow
import type { Action } from './Action'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResult } from './BankApiResult'

const { nonNullNumber } = require('./assertType')

class FakeBankApi {
  nextClientId: number
  actions: Array<Action>

  constructor() {
    this.nextClientId = 1
    this.actions = []
  }
  sync(request: BankApiRequest): BankApiResult {
    let clientId: number
    if (request.clientId === null) {
      clientId = this.nextClientId
      this.nextClientId += 1
    } else {
      clientId = request.clientId
    }

    for (const action of request.actionsFromClient) {
      if (action.clientId === null) {
        action.clientId = clientId
      }
      this.actions.push(action)
    }

    let actionsToClient = []
    for (const action of this.actions) {
      if (action.actionId > (request.clientIdToMaxSyncedActionId.get(
              nonNullNumber(action.clientId)) || 0)) {
        actionsToClient.push(action)
      }
    }

    return { clientId, actionsToClient }
  }
}

module.exports = FakeBankApi
