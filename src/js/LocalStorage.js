export const SYNCED_KEY   = 'LocalBankSynced'
export const UNSYNCED_KEY = 'LocalBankUnsynced'

export type LocalStorage = {
  getItem(key: string): string | null,
  setItem(key: string, value: string): void
}
