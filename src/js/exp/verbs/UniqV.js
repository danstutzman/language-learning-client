import type {Tense} from './Tense'
import type {Person} from './Person'
import type {Number} from './Number'
import Inf from './Inf'
import Exp from '../Exp'

export default class UniqV extends Exp {
  inf:    Inf
  tense:  Tense
  person: Person
  number: Number
  es:     string

  constructor(
    expId:  number,
    inf:    Inf,
    tense:  Tense,
    person: Person,
    number: Number,
    es:     string
  ) {
    super('UniqV', expId)
    this.inf    = inf
    this.tense  = tense
    this.person = person
    this.number = number
    this.es     = es
  }

  toEs(): string {
    return this.es
  }

  toMorphemes(): Array<string> {
    return [this.es]
  }

  subExps(): Array<Exp> {
    return [this].concat(this.inf.subExps())
  }
}