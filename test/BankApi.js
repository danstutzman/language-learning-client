// @flow
import type { BankApiResult } from './BankApiResult'

export type BankApi = {
  sync(clientId: number | null): BankApiResult
}
