import Exp from '../Exp'
import type {Gender} from './Gender'

export default class Adj extends Exp {
  es:     string
  en:     string
  gender: Gender

  constructor(expId:number, es:string, en:string, gender:Gender) {
    super('Adj', expId)
    this.es     = es
    this.en     = en
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