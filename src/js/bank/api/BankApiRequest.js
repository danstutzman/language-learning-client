import type { Action } from '../Action'
import type { Exposure } from '../../Exposure'

export type BankApiRequest = {|
  clientId: number,
  clientIdToMaxSyncedActionId: {[clientId: string]: number},
  actionsFromClient: Array<Action>,
  exposures: Array<Exposure>
|}
