// @flow

const SYNCED_KEY   = 'LocalBankSynced'
const UNSYNCED_KEY = 'LocalBankUnsynced'

export type LocalStorage = {
  getItem(key: string): string | null,
  setItem(key: string, value: string): void
}

module.exports = { SYNCED_KEY, UNSYNCED_KEY }
