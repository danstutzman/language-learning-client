// @flow
import type { Action } from './Action'
import type { BankApiResult } from './BankApiResult'

export type BankApi = {
  sync(clientId: number | null, actionsFromClient: Array<Action>): BankApiResult
}
