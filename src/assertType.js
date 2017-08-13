export function assertNum(x: any): number {
  if (typeof x !== 'number') {
    throw new Error(`Unexpected type ${typeof x}`)
  } else {
    return x
  }
}

export function assertObj(x: any): {} {
  if (x === null) {
    throw new Error("Unexpected null")
  } else if (Array.isArray(x)) {
    throw new Error("Unexpected array")
  } else if (typeof x !== 'object') {
    throw new Error(`Unexpected type ${typeof x}`)
  } else {
    return x
  }
}
