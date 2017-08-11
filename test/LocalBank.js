// @flow
import type { BankApi } from './BankApi'
import type { BankApiResult } from './BankApiResult'

class LocalBank {
  bankApi: BankApi
  clientId: number | null // null means unassigned

  constructor(bankApi: BankApi) {
    this.bankApi = bankApi
    this.clientId = null
  }
  sync() {
    console.log(`Sync is sending clientId=${this.clientId || 'null'}`)
    const response: BankApiResult = this.bankApi.sync(this.clientId)
    console.log(`Sync got back ${JSON.stringify(response)}`)

    if (response.clientId === null) {
      throw new Error("Expected to be assigned a clientId")
    }
    if (this.clientId === null) {
      this.clientId = response.clientId
    } else if (response.clientId !== this.clientId) {
      throw new Error(`Had clientId ${this.clientId}
          but reassigned ${response.clientId}`)
    }
  }
}

module.exports = LocalBank
