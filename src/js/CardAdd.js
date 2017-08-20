import { assertObj, assertStr } from './assertType'
import { assertCardType, assertCardGender } from './Card'

export type CardAdd = {|
  type:     'EsN',
  gender:   'M' | 'F' | '',
  es:       string,
  en:       string,
  mnemonic: string
|}

export function assertCardAdd(x: any): CardAdd {
  assertObj(x)

  assertCardType(x.type)
  assertCardGender(x.gender)
  assertStr(x.es)
  assertStr(x.en)
  assertStr(x.mnemonic)

  return x
}
