export const CARD_GENDER_TO_STRING = {
  '': '',
  M: 'M', // masculine
  F: 'F'  // feminine
}

export type CardGender = $Keys<typeof CARD_GENDER_TO_STRING>

export function assertCardGender(x: any): CardGender {
  if (CARD_GENDER_TO_STRING[x] === undefined) {
    throw new Error(`Expected Card Gender but got ${x}`)
  }
  return x
}
