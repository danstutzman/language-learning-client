// @flow
import type { BankData } from './BankData'

const Ajax = require('./Ajax').Ajax

class BankApi {
  url: string
  ajax: Ajax

  constructor(url: string) {
    this.url = url
    this.ajax = new Ajax()
  }
  post(data: any): Promise<BankData> {
    return this.ajax.post(this.url, data)
  }
}

module.exports = { BankApi }
