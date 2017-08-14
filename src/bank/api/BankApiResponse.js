import type { Action } from '../Action'
import { assertObj } from '../../assertType'
import { assertArrayAction } from '../Action'

export interface BankApiResponse {
  actionsToClient: Array<Action>
}

export function assertBankApiResponse(x: any): BankApiResponse {
  const y = assertObj(x)

  if (y.actionsToClient === undefined) {
    throw new Error(`Missing actionsToClient in ${JSON.stringify(y)}`)
  }
  const actionsToClient = assertArrayAction(y.actionsToClient)

  return { actionsToClient }
}
