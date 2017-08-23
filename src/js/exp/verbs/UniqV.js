import type {Tense} from './Tense'
import type {Person} from './Person'
import type {Number} from './Number'

export default class UniqV {
  infEs:  string
  tense:  Tense
  person: Person
  number: Number
  es:     string

  constructor(
    infEs:  string,
    tense:  Tense,
    person: Person,
    number: Number,
    es:     string
  ) {
    this.infEs  = infEs
    this.tense  = tense
    this.person = person
    this.number = number
    this.es     = es
  }

  toMorphemes(): Array<string> {
    return [this.es]
  }
}