import { assertBool, assertNum, assertObj, assertStr } from './assertType'
import type {CardNumber} from "./CardNumber"
import {assertCardGender} from "./CardGender"
import type {CardGender} from "./CardGender"

const MINUTES = 60 * 1000
const HOURS = 60 * MINUTES
const DAY = 24 * HOURS

export const STAGE0_MISSING_FIELDS    = 0
export const STAGE1_COMPLETE_FIELDS   = 1

export const STAGE_TIME_THRESHOLD = [
   0,           //  ->0 is not applicable
   0,           // 0->1 isn't controlled by flashcard success
  10 * MINUTES, // 1->2
   1 * HOURS,   // 2->3
   6 * HOURS,   // 3->4
   1 * DAY      // 4->5
]

export const CARD_TYPE_TO_STRING = {
  '': '',
  EsN: 'EsN', // noun
  EsD: 'EsD'  // determiner
}

export type CardType = $Keys<typeof CARD_TYPE_TO_STRING>

export type Card = {|
  cardId:         number,
  type:           CardType,
  gender:         CardGender,
  es:             string,
  en:             string,
  mnemonic:       string,
  suspended:      boolean,
  stageNum:       number,
  lastSeenAt:     number, // milliseconds since epoch, 0 for never
  number:         CardNumber
|}

export function assertCardType(x: any): CardType {
  if (CARD_TYPE_TO_STRING[x] === undefined) {
    throw new Error(`Expected CardType but got ${x}`)
  }
  return x
}

export function assertCard(x: any): Card {
  assertObj(x)

  assertNum(x.cardId)
  assertCardType(x.type)
  assertCardGender(x.gender)
  assertStr(x.es)
  assertStr(x.en)
  assertStr(x.mnemonic)
  assertBool(x.suspended)
  assertNum(x.stageNum)

  return x
}

export function newCard(): Card {
  return {
    cardId:     -1,
    type:       '',
    gender:     '',
    es:         '',
    en:         '',
    mnemonic:   '',
    suspended:  false,
    stageNum:   STAGE0_MISSING_FIELDS,
    lastSeenAt: 0,
    number:     ''
  }
}
