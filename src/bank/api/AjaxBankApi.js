import type { BankApiRequest } from './BankApiRequest'
import type { BankApiResponse } from './BankApiResponse'
import type Ajax from '../../Ajax'
import { assertBankApiResponse } from './BankApiResponse'

class AjaxBankApi {
  ajax: Ajax
  url: string

  constructor(ajax: Ajax, url: string) {
    this.ajax = ajax
    this.url = url
  }

  sync(request: BankApiRequest): Promise<BankApiResponse> {
    return this.ajax.post(this.url, request).then(response => {
      try {
        return assertBankApiResponse(response)
      } catch (e) {
        console.error(`Bad response was: ${JSON.stringify(response)}`)
        throw e
      }
    })
  }
}

export default AjaxBankApi
