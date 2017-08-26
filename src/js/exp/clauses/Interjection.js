import Exp from '../Exp'

export default class Interjection extends Exp {
  es:          string
  en:          string
  composition: Exp

  constructor(expId:number, es:string, en:string, composition:Exp) {
    super('Interjection', expId)
    this.es          = es
    this.en          = en
    this.composition = composition
  }

  toEs(): string {
    return this.es
  }

  toMorphemes(): Array<string> {
    return [this.es]
  }

  subExps(): Array<Exp> {
    return this.composition.subExps()
  }
}