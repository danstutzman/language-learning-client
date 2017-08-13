import type { Action } from './Action'

export interface BankApiResponse {
  actionsToClient: Array<Action>
}
