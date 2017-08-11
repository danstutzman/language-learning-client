// @flow
import type { Action } from './Action'

export interface BankApiResult {
  clientId: number,
  actionsToClient: Array<Action>
}
