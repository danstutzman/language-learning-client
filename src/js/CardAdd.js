import { assertObj, assertStr } from './assertType'
import {assertCardNumber} from "./CardNumber"
import type {CardGender} from "./CardGender"
import {assertCardGender} from "./CardGender"
import {assertCardType} from "./CardType"
import type {CardType} from "./CardType"

export type CardAdd = {|
  type:     CardType,
  gender:   CardGender,
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
