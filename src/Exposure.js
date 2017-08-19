import { assertNum, assertObj } from './assertType'

// Time ran out on Fast Quiz screen
export type FastBlink = {
  type: 'FAST_BLINK',
  cardId: number
}

// Clicked 'I remember this' on Fast Quiz screen
export type FastNod = {
  type: 'FAST_NOD',
  cardId: number
}

// Clicked 'I remember this' on Slow Quiz screen
export type SlowNod = {
  type: 'SLOW_NOD',
  cardId: number
}

// Clicked 'Try again later' on Slow Quiz screen
export type SlowShake = {
  type: 'SLOW_SHAKE',
  cardId: number
}

export type Exposure = FastBlink | FastNod | SlowNod | SlowShake

export function assertExposure(x: any): Exposure {
  assertObj(x)

  if (!(x.type === 'FAST_BLINK' ||
        x.type === 'FAST_NOD' ||
        x.type === 'SLOW_NOD' ||
        x.type === 'SLOW_SHAKE')) {
    throw new Error(`Unknown type on ${JSON.stringify(x)}`)
  }

  if (!x.cardId) {
    throw new Error(`No cardId on ${JSON.stringify(x)}`)
  }
  assertNum(x.cardId)

  return x
}
