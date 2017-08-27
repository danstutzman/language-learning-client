import type {Tense} from './Tense'
import Exp from '../Exp'
import Inf from './Inf'

export default class StemChange extends Exp {
  tense: Tense
  inf:   Inf
  stem:  string

  constructor(expId:number, tense:Tense, inf:Inf, stem:string) {
    super('StemChange', expId)
    this.tense = tense
    this.inf   = inf
    this.stem  = stem.normalize('NFC')
  }

  subExps(): Array<Exp> {
    return [this].concat(this.inf.subExps())
  }

  toEs(): string {
    return this.stem
  }
}