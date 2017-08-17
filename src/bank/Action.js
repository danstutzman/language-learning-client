import { assertNum, assertObj } from '../assertType'
import type { Card }            from '../Card'
import type { Exposure }        from '../Exposure'
import { assertCard }           from '../Card'
import { assertExposure }       from '../Exposure'

export type NoopAction = {
  type:            'NOOP',
  actionId:        number,
  createdAtMillis: number
}

export type AddCardAction = {
  type:            'ADD_CARD',
  actionId:        number,
  createdAtMillis: number,
  card:            Card
}

export type AddExposureAction = {
  type:            'ADD_EXPOSURE',
  actionId:        number,
  createdAtMillis: number,
  exposure:        Exposure
}

export type Action = NoopAction | AddCardAction | AddExposureAction

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
  assertActionType(y.type)

  if (!y.actionId) {
    throw new Error(`No actionId on ${JSON.stringify(y)}`)
  }
  assertNum(y.actionId)

  if (!y.createdAtMillis) {
    throw new Error(`No createdAtMillis on ${JSON.stringify(y)}`)
  }
  assertNum(y.createdAtMillis)

  if (y.type === 'ADD_CARD') {
    if (!y.card) {
      throw new Error(`No card on ${JSON.stringify(x)} despite type=ADD_CARD`)
    }
    assertCard(x.card)
  }

  if (y.type === 'ADD_EXPOSURE') {
    if (!y.exposure) {
      throw new Error(
        `No exposure on ${JSON.stringify(y)} despite type=ADD_EXPOSURE`)
    }
    assertExposure(y.exposure)
  }

  return (y:any)
}

export function assertAddCardAction(x: Action): AddCardAction {
  if (x.type !== 'ADD_CARD') {
    throw new Error(`Unexpected type ${JSON.stringify(x.type)}`)
  }

  if (x.card === undefined) {
    throw new Error(`No card on ${JSON.stringify(x)}`)
  }
  assertCard(x.card)

  return (x: any)
}

export function assertArrayAction(x: any): Array<Action> {
  if (!Array.isArray(x)) {
    throw new Error("Unexpected non-array")
  }
  return x.map(y => { return assertAction(y) })
}
