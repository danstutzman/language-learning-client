import Exp from '../Exp'
import type {N} from './N'
import Det from './Det'

export default class NP extends Exp {
  det:   Det | null
  nouns: Array<N>

  constructor(expId:number, det:Det|null, nouns:Array<N>) {
    super('NP', expId)
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
    if (this.det === null && this.nouns.length === 1){
      return this.nouns[0].subExps()
    } else {
      let exps = [this]
      exps = exps.concat(this.det === null ? [] : this.det.subExps())
      for (const n of this.nouns) {
        exps = exps.concat(n.subExps())
      }
      return exps
    }
  }
}