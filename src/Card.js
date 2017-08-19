import { assertNonBlankStr, assertNum, assertObj } from './assertType'

export type Card = {
  cardId:         number,
  type:           'EsN',
  gender:         'M' | 'F' | '',
  es:             string,
  en:             string,
  mnemonic?:      string,
  numFastNods?:   number,
  hadFastBlink?:  boolean,
  lastFastNod?:   number,
  lastSlowNod?:   number,
  suspended?:     boolean,
  lastSlowShake?: number
}

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
  if (x.cardId <= 0) {
    throw new Error(`Non-positive cardId on ${JSON.stringify(x)}`)
  }

  if (x.type !== 'EsN') {
    throw new Error(`Unknown type on ${JSON.stringify(x)}`)
  }

  return x
}

export function assertQuizzableCard(x: any): Card {
  const y = assertObj(x)

  if (y.type !== 'EsN') {
    throw new Error(`Unknown type on ${JSON.stringify(y)}`)
  }

  if (!(y.gender === 'M' || y.gender === 'F')) {
    throw new Error(`Unknown gender on ${JSON.stringify(y)}`)
  }

  assertNonBlankStr(x.es)
  assertNonBlankStr(x.en)

  return x
}
