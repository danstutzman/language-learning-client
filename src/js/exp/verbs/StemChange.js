import type {Tense} from './Tense'

export default class StemChange {
  tense: Tense
  infEs: string
  stem:  string

  constructor(tense:Tense, infEs:string, stem:string) {
    this.tense = tense
    this.infEs = infEs
    this.stem  = stem
  }
}