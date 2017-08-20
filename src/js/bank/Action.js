import { assertNum, assertObj }  from '../assertType'
import type { CardAdd }          from '../CardAdd'
import type { CardUpdate }       from '../CardUpdate'
import { assertCardAdd }         from '../CardAdd'
import { assertCardUpdate }      from '../CardUpdate'

export type NoopAction = {
  type:            'NOOP',
  actionId:        number,
  createdAtMillis: number
}

export type AddCardAction = {
  type:            'ADD_CARD',
  actionId:        number,
  createdAtMillis: number,
  cardAdd:         CardAdd
}

export type UpdateCardAction = {
  type:            'UPDATE_CARD',
  actionId:        number,
  createdAtMillis: number,
  cardId:          number,
  cardUpdate:      CardUpdate
}

export type Action = NoopAction
 | AddCardAction
 | UpdateCardAction

function assertActionType(x: any):
    'NOOP' | 'ADD_CARD' | 'UPDATE_CARD' {
  if (!(x === 'NOOP' ||
        x === 'ADD_CARD' ||
        x === 'UPDATE_CARD')) {
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
    if (!y.cardAdd) {
      throw new Error(
        `No cardAdd on ${JSON.stringify(x)} despite type=${x.type}`)
    }
    assertCardAdd(x.cardAdd)
  }

  if (y.type === 'UPDATE_CARD') {
    if (!y.cardUpdate) {
      throw new Error(
        `No cardUpdate on ${JSON.stringify(x)} despite type=${x.type}`)
    }
    assertCardUpdate(x.cardUpdate)
  }

  return (y:any)
}

export function assertAddCardAction(x: Action): AddCardAction {
  if (x.type !== 'ADD_CARD') {
    throw new Error(`Unexpected type ${JSON.stringify(x.type)}`)
  }

  if (x.cardAdd === undefined) {
    throw new Error(`No cardAdd on ${JSON.stringify(x)}`)
  }
  assertCardAdd(x.cardAdd)

  return (x: any)
}

export function assertUpdateCardAction(x: Action): UpdateCardAction {
  if (x.type !== 'UPDATE_CARD') {
    throw new Error(`Unexpected type ${JSON.stringify(x.type)}`)
  }

  if (!x.cardId) {
    throw new Error(`No cardId on ${JSON.stringify(x)}`)
  }
  assertNum(x.cardId)

  if (x.cardUpdate === undefined) {
    throw new Error(`No cardUpdate on ${JSON.stringify(x)}`)
  }
  assertCardUpdate(x.cardUpdate)

  return (x: any)
}

export function assertArrayAction(x: any): Array<Action> {
  if (!Array.isArray(x)) {
    throw new Error("Unexpected non-array")
  }
  return x.map(y => { return assertAction(y) })
}
