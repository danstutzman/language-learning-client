import Exp from '../Exp'
import type {N} from './N'
import Det from './Det'

export default class NP extends Exp {
  expId: number
  det:   Det | null
  nouns: Array<N>

  constructor(expId:number, det:Det|null, nouns:Array<N>) {
    super(expId)
    this.det   = det
    this.nouns = nouns
  }

  toEs(): string {
    return (this.det === null ? [] : [this.det.toEs()])
      .concat(this.nouns.map(n => n.toEs()))
      .join(' ')
  }

  toMorphemes(): Array<string> {
    let morphemes = this.det === null ? [] : this.det.toMorphemes()
    for (const n of this.nouns) {
      morphemes = morphemes.concat(n.toMorphemes())
    }
    return morphemes
  }

  subExps(): Array<Exp> {
    let exps = [this]
    exps = exps.concat(this.det === null ? [] : this.det.subExps())
    for (const n of this.nouns) {
      exps = exps.concat(n.subExps())
    }
    return exps
  }
}