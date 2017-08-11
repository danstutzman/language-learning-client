// @flow
import type { Action } from './Action'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'

export type BankApi = {
  sync(request: BankApiRequest): BankApiResponse
}
