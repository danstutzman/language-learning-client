// @flow
import type { Action } from './Action'

export interface BankApiResponse {
  clientId: number,
  actionsToClient: Array<Action>
}
