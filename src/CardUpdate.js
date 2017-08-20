import { assertBool, assertNum, assertObj, assertStr } from './assertType'
import { assertCardGender } from './Card'

export type CardUpdate = {|
  gender?:    'M' | 'F' | '',
  es?:        string,
  en?:        string,
  mnemonic?:  string,
  suspended?: boolean,
  stageNum?:  number
|}

export function assertCardUpdate(x: any): CardUpdate {
  assertObj(x)

  if (x.gender !== undefined)    { assertCardGender(x.gender) }
  if (x.es !== undefined)        { assertStr(x.es) }
  if (x.en !== undefined)        { assertStr(x.en) }
  if (x.mnemonic !== undefined)  { assertStr(x.mnemonic) }
  if (x.suspended !== undefined) { assertBool(x.suspended) }
  if (x.stageNum !== undefined)  { assertNum(x.stageNum) }

  return x
}
