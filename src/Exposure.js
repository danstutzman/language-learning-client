import { assertNonBlankStr, assertNum, assertObj } from './assertType'

// Exposure types:
//   FAST_BLINK: Time ran out on Fast Quiz screen
//   FAST_NOD: Clicked 'I remember this' on Fast Quiz screen
//   SLOW_NOD: Clicked 'I remember this' on Slow Quiz screen
//   SLOW_SHAKE: Clicked 'Try again later' on Slow Quiz screen
export type Exposure = {
  type: string,
  es: string,
  promptedAt: number,
  respondedAt: number
}

export function assertExposure(x: any): Exposure {
  assertObj(x)

  assertNonBlankStr(x.type)
  assertNonBlankStr(x.es)
  assertNum(x.promptedAt)
  assertNum(x.respondedAt)

  return x
}

export function assertArrayExposure(x: any): Array<Exposure> {
  if (!Array.isArray(x)) {
    throw new Error("Unexpected non-array")
  }
  return x.map(y => { return assertExposure(y) })
}
