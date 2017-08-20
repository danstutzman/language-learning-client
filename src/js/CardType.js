export const CARD_TYPE_TO_STRING = {
  '': '',
  EsN: 'EsN', // noun
  EsD: 'EsD'  // determiner
}

export type CardType = $Keys<typeof CARD_TYPE_TO_STRING>

export function assertCardType(x: any): CardType {
  if (CARD_TYPE_TO_STRING[x] === undefined) {
    throw new Error(`Expected CardType but got ${x}`)
  }
  return x
}
