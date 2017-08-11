// @flow

class LocalBank {
  api: FakeBankApi
  clientId: number | null // null means unassigned

  constructor(api: FakeBankApi) {
    this.api = api
    this.clientId = null
  }
  sync() {
    console.log(`Sync is sending clientId=${this.clientId || 'null'}`)
    const response = this.api.sync(this.clientId)
    console.log(`Sync got back ${JSON.stringify(response)}`)
  }
}

class FakeBankApi {
  nextClientId: number

  constructor() {
    this.nextClientId = 1
  }
  sync(clientId: number | null) {
    if (clientId === null) {
      clientId = this.nextClientId
      this.nextClientId += 1
    }

    return { clientId: clientId }
  }
}

const api = new FakeBankApi()
const client = new LocalBank(api)
client.sync()
