import type {Tense} from './Tense'
import type {Person} from './Person'
import type {Number} from './Number'

export default class UniqV {
  expId:  number
  infEs:  string
  tense:  Tense
  person: Person
  number: Number
  es:     string

  constructor(
    expId:  number,
    infEs:  string,
    tense:  Tense,
    person: Person,
    number: Number,
    es:     string
  ) {
    this.expId  = expId
    this.infEs  = infEs
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
}