export const CARD_NUMBER_TO_STRING = {
  '': '',
  S: 'S', // singular
  P: 'P'  // plural
}

export type CardNumber = $Keys<typeof CARD_NUMBER_TO_STRING>

export function assertCardNumber(x: any): CardNumber {
  if (CARD_NUMBER_TO_STRING[x] === undefined) {
    throw new Error(`Expected CardNumber but got ${x}`)
  }
  return x
}