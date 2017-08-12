// @flow
import type { Action } from './Action'
import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'
import type Ajax from './Ajax'

class AjaxBankApi {
  ajax: Ajax
  url: string

  constructor(ajax: Ajax, url: string) {
    this.ajax = ajax
    this.url = url
  }

  sync(request: BankApiRequest): Promise<BankApiResponse> {
    return this.ajax.post(this.url, request)
  }
}

module.exports = AjaxBankApi
