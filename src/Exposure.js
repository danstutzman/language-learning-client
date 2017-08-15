import { assertBool, assertNum, assertObj } from './assertType'

export type Exposure = {
  cardId: number,
  remembered: boolean
}

export function assertExposure(x: any): Exposure {
  const y = assertObj(x)

  if (!y.cardId) {
    throw new Error(`No cardId on ${JSON.stringify(y)}`)
  }
  const cardId = assertNum(y.cardId)

  if (y.remembered === undefined || y.remembered === null) {
    throw new Error(`No remembered on ${JSON.stringify(y)}`)
  }
  const remembered = assertBool(y.remembered)

  return { cardId, remembered }
}
