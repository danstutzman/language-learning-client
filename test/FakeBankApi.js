// @flow

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

module.exports = FakeBankApi
