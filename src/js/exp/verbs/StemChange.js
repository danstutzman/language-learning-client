import type {Tense} from './Tense'

export default class StemChange {
  expId: number
  tense: Tense
  infEs: string
  stem:  string

  constructor(expId:number, tense:Tense, infEs:string, stem:string) {
    this.expId = expId
    this.tense = tense
    this.infEs = infEs
    this.stem  = stem
  }
}