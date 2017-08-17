export function assertBool(x: any): boolean {
  if (typeof x !== 'boolean') {
    throw new Error(`Unexpected type ${typeof x}`)
  } else {
    return x
  }
}

export function assertNonBlankStr(x: any): string {
  if (typeof x !== 'string') {
    throw new Error(`Unexpected type ${typeof x}`)
  } else if (x === '') {
    throw new Error(`Unexpected blank`)
  } else {
    return x
  }
}

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

export function assertObjNum(x: any): {[key: string]: number} {
  const copy: {[key:string]: number} = {}
  const y = assertObj(x)
  for (const key in y) {
    copy[key] = y[key]
  }
  return y
}
