import type {InfCategory} from './InfCategory'
import type {Tense} from './Tense'
import type {Person} from './Person'
import type {Number} from './Number'
import Exp from '../Exp'

export default class RegPattern extends Exp {
  infCategory: InfCategory
  tense:       Tense
  person:      Person
  number:      Number
  suffix:      string

  constructor(expId: number, infCategory: InfCategory, tense: Tense,
              person: Person, number: Number, suffix: string) {
    super('RegPattern', expId)
    this.infCategory = infCategory
    this.tense       = tense
    this.person      = person
    this.number      = number
    this.suffix      = suffix
  }

  subExps(): Array<Exp> {
    return [this]
  }

  toEs(): string {
    return this.suffix
  }
}
