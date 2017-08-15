import { assertObj, assertStr } from './assertType'

export type Card = {
  type:        'EsN',
  gender:      'M' | 'F',
  es:          string,
  en:          string,
  remembered?: boolean
}

function assertCardType(x: any): 'EsN' {
  if (x !== 'EsN') {
    throw new Error(`Expected Card Type but got ${x}`)
  }
  return x
}

function assertCardGender(x: any): 'M' | 'F' {
  if (x !== 'M' && x !== 'F') {
    throw new Error(`Expected Card Gender but got ${x}`)
  }
  return x
}

export function assertCard(x: any): Card {
  const y = assertObj(x)

  if (!y.type) {
    throw new Error(`No type on ${JSON.stringify(y)}`)
  }
  const type = assertCardType(y.type)

  if (!y.gender) {
    throw new Error(`No gender on ${JSON.stringify(y)}`)
  }
  const gender = assertCardGender(y.gender)

  if (!y.es) {
    throw new Error(`No es on ${JSON.stringify(y)}`)
  }
  const es = assertStr(y.es)

  if (!y.en) {
    throw new Error(`No en on ${JSON.stringify(y)}`)
  }
  const en = assertStr(y.en)

  return { type, gender, es, en }
}
