import { assertNonBlankStr, assertNum, assertObj } from './assertType'

// Exposure types:
//   LISTEN_BLINK: Time ran out on Listen screen
//   LISTEN_NOD: Clicked 'I remember this' on Listen screen
//   SPEAK_NOD: Clicked 'I remember this' on Speak screen
//   SPEAK_SHAKE: Clicked 'Try again later' on Speak screen
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
