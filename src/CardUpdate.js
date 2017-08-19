import { assertBool, assertNonBlankStr, assertObj } from './assertType'
import { assertCardGender } from './Card'

export type CardUpdate = {|
  gender?:    'M' | 'F' | '',
  es?:        string,
  en?:        string,
  mnemonic?:  string,
  suspended?: boolean
|}

export function assertCardUpdate(x: any): CardUpdate {
  assertObj(x)

  if (x.gender !== undefined)    { assertCardGender(x.gender) }
  if (x.es !== undefined)        { assertNonBlankStr(x.es) }
  if (x.en !== undefined)        { assertNonBlankStr(x.en) }
  if (x.mnemonic !== undefined)  { assertNonBlankStr(x.mnemonic) }
  if (x.suspended !== undefined) { assertBool(x.suspended) }

  return x
}
