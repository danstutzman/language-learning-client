import { SYNCED_KEY, UNSYNCED_KEY } from '../src/LocalStorage'

class FakeLocalStorage {
  map: Map<string, string>

  constructor(clientId: number) {
    this.map = new Map()
    this.setItem(SYNCED_KEY, JSON.stringify({
      clientId:                    clientId,
      actions:                     [],
      clientIdToMaxSyncedActionId: new Map()
    }))
    this.setItem(UNSYNCED_KEY, JSON.stringify({
      unsyncedActions: [],
      nextActionId:    10 + clientId,
    }))
  }

  getItem(key: string): string | null {
    const value = this.map.get(key)
    return (value === undefined) ? null : value
  }

  setItem(key: string, value: string) {
    this.map.set(key, value)
  }
}

module.exports = FakeLocalStorage
