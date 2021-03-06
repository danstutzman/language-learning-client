import type {CardType} from "./CardType"
import { assertBool, assertNum, assertObj, assertStr } from './assertType'
import {assertCardGender} from "./CardGender"
import {assertCardType} from "./CardType"
import type {CardGender} from "./CardGender"
import type {CardNumber} from "./CardNumber"

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
