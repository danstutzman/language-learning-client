import { assertBool, assertNum, assertObj, assertStr } from './assertType'

export const STAGE0_MISSING_FIELDS = 0
export const STAGE1_COMPLETE_FIELDS = 1

export type Card = {|
  cardId:         number,
  type:           'EsN',
  gender:         'M' | 'F' | '',
  es:             string,
  en:             string,
  mnemonic:       string,
  suspended:      boolean,
  stageNum:       number
|}

export function assertCardType(x: any): 'EsN' {
  if (x !== 'EsN') {
    throw new Error(`Expected Card Type but got ${x}`)
  }
  return x
}

export function assertCardGender(x: any): 'M' | 'F' | '' {
  if (!(x === 'M' || x === 'F' || x === '')) {
    throw new Error(`Expected Card Gender but got ${x}`)
  }
  return x
}

export function assertCard(x: any): Card {
  assertObj(x)

  if (x.cardId === undefined) {
    throw new Error(`No cardId on ${JSON.stringify(x)}`)
  }
  assertNum(x.cardId)

  if (x.type !== 'EsN') {
    throw new Error(`Unknown type on ${JSON.stringify(x)}`)
  }

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
    cardId: -1,
    type: 'EsN',
    gender: '',
    es: '',
    en: '',
    mnemonic: '',
    suspended: false,
    stageNum: STAGE0_MISSING_FIELDS
  }
}
