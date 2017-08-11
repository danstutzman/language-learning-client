// @flow
import type { Action } from './Action'
import type { BankApiResult } from './BankApiResult'
import type { BankApiRequest } from './BankApiRequest'

export type BankApi = {
  sync(request: BankApiRequest): BankApiResult
}
