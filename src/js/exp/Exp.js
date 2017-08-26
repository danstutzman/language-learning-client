export default class Exp {
  type: string
  expId: number

  constructor(type:string, expId:number) {
    this.type  = type
    this.expId = expId
  }

  toEs(): string {
    throw new Error(`toEs() not implemented on ${this.type}`)
  }

  subExps(): Array<Exp> {
    throw new Error(`subExps() not implemented on ${this.type}`)
  }
}