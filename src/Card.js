import { assertNonBlankStr, assertObj } from './assertType'

export type Card = {
  type:        'EsN',
  gender:      'M' | 'F' | void,
  es:          string | void,
  en:          string | void,
  remembered?: boolean
}

export function assertCardType(x: any): 'EsN' {
  if (x !== 'EsN') {
    throw new Error(`Expected Card Type but got ${x}`)
  }
  return x
}

export function assertCardGender(x: any): 'M' | 'F' {
  if (x !== 'M' && x !== 'F') {
    throw new Error(`Expected Card Gender but got ${x}`)
  }
  return x
}

export function assertCard(x: any): Card {
  const y = assertObj(x)

  if (y.type !== 'EsN') {
    throw new Error(`Unknown type on ${JSON.stringify(y)}`)
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
