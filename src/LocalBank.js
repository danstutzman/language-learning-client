// @flow
import type { BankApi } from './BankApi'
import type { BankData } from './BankData'

export type LocalStorage = {
  setItem(key: string, value: string): null
}

class LocalBank {
  localStorage: LocalStorage
  bankApi: BankApi
  bankData: BankData | void

  constructor(localStorage: LocalStorage, bankApi: BankApi) {
    this.localStorage = localStorage
    this.bankApi = bankApi
    this.bankData = undefined
  }
  sync(): Promise<void> {
    return this.bankApi.post({})
      .then((bankData: BankData) => {
        this.bankData = bankData
        this.localStorage.setItem('bankData', JSON.stringify(this.bankData))
      })
  }
}

module.exports = LocalBank
