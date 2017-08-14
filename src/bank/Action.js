import { assertNum, assertObj } from '../assertType'

export type Action = {
  type: 'ADD_CARD',
  actionId: number,
  createdAtMillis: number
}

function assertActionType(x: any): 'ADD_CARD' {
  if (x !== 'ADD_CARD') {
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

  return { type, actionId, createdAtMillis }
}

export function assertArrayAction(x: any): Array<Action> {
  if (!Array.isArray(x)) {
    throw new Error("Unexpected non-array")
  }
  return x.map(y => { return assertAction(y) })
}
