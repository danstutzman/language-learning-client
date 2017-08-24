export default class Exp {
  expId: number

  constructor(expId: number) {
    this.expId = expId
  }

  toEs(): string {
    throw new Error(`toEs not implemented on ${JSON.stringify(this)}`)
  }
}