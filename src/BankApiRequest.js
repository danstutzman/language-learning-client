import type { Action } from './Action'

export type BankApiRequest = {
  clientId: number,
  clientIdToMaxSyncedActionId: {[clientId: string]: number},
  actionsFromClient: Array<Action>
}
