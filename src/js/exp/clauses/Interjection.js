import Exp from '../Exp'

export default class Interjection extends Exp {
  es:        string
  en:        string
  morphemes: Array<string>

  constructor(expId:number, es:string, en:string, morphemes:Array<string>) {
    super('Interjection', expId)
    this.es        = es
    this.en        = en
    this.morphemes = morphemes
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