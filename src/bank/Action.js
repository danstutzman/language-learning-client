import { assertNum, assertObj } from '../assertType'
import type { Card }            from '../Card'
import type { Exposure }        from '../Exposure'
import { assertCard }           from '../Card'
import { assertExposure }       from '../Exposure'

export type Action = {
  type:            'NOOP' | 'ADD_CARD' | 'ADD_EXPOSURE',
  actionId:        number,
  createdAtMillis: number,
  card?:           Card,
  exposure?:       Exposure
}

function assertActionType(x: any): 'NOOP' | 'ADD_CARD' | 'ADD_EXPOSURE' {
  if (x !== 'NOOP' && x !== 'ADD_CARD' && x != 'ADD_EXPOSURE') {
    throw new Error(`Expected Action Type but got ${x}`)
  }
  return x
}

export function assertAction(x: any): Action {
  const y = assertObj(x)

  if (!y.type) {
    throw new Error(`No type on ${JSON.stringify(y)}`)
  }
  const type = assertActionType(y.type)

  if (!y.actionId) {
    throw new Error(`No actionId on ${JSON.stringify(y)}`)
  }
  const actionId = assertNum(y.actionId)

  if (!y.createdAtMillis) {
    throw new Error(`No createdAtMillis on ${JSON.stringify(y)}`)
  }
  const createdAtMillis = assertNum(y.createdAtMillis)

  let card: Card | void = undefined
  if (y.type === 'ADD_CARD') {
    if (!y.card) {
      throw new Error(`No card on ${JSON.stringify(y)} despite type=ADD_CARD`)
    }
    card = assertCard(y.card)
  }

  let exposure: Exposure | void = undefined
  if (y.type === 'ADD_EXPOSURE') {
    if (!y.exposure) {
      throw new Error(
        `No exposure on ${JSON.stringify(y)} despite type=ADD_EXPOSURE`)
    }
    exposure = assertExposure(y.exposure)
  }

  return { type, actionId, createdAtMillis, card, exposure }
}

export function assertArrayAction(x: any): Array<Action> {
  if (!Array.isArray(x)) {
    throw new Error("Unexpected non-array")
  }
  return x.map(y => { return assertAction(y) })
}
