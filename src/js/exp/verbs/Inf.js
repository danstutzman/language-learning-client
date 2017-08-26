import Exp from '../Exp'

export default class Inf extends Exp {
  expId: number
  en:    string
  es:    string

  constructor(expId:number, en:string, es:string) {
    super(expId)
    this.en    = en
    this.es    = es
  }

  toEs(): string {
    return this.es
  }

  toMorphemes(): Array<string> {
    return [this.es]
  }

  subExps(): Array<Exp> {
    return [this]
  }
}