import { assertObj, assertStr } from './assertType'
import { assertCardType, assertCardGender } from './Card'
import {assertCardNumber} from "./CardNumber"
import type {CardType} from "./Card";

export type CardAdd = {|
  type:     CardType,
  gender:   'M' | 'F' | '',
  es:       string,
  en:       string,
  mnemonic: string,
  number?:  string
|}

export function assertCardAdd(x: any): CardAdd {
  assertObj(x)

  assertCardType(x.type)
  assertCardGender(x.gender)
  assertStr(x.es)
  assertStr(x.en)
  assertStr(x.mnemonic)
  if (x.cardType === 'EsD') {
    assertCardNumber(x.number)
  }

  return x
}
