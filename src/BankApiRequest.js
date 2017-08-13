import type { Action } from './Action'

export type BankApiRequest = {
  clientId: number | null,
  clientIdToMaxSyncedActionId: Map<number, number>,
  actionsFromClient: Array<Action>
}
