import Exp from '../Exp'
import type {Gender} from './Gender'

export default class CommonN extends Exp {
  en:     string
  es:     string
  gender: Gender

  constructor(expId:number, en:string, es:string, gender:Gender) {
    super('CommonN', expId)
    this.en     = en
    this.es     = es
    this.gender = gender
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