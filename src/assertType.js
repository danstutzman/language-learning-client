function nonNullNumber(n: number | null) {
  if (n === null) {
    throw new Error("Unexpected null")
  } else {
    return n
  }
}

export default { nonNullNumber }
