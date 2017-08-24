export default class Inf {
  expId: number
  en:    string
  es:    string

  constructor(expId:number, en:string, es:string) {
    this.expId = expId
    this.en    = en
    this.es    = es
  }

  toEs(): string {
    return this.es
  }
}