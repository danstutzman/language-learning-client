import Exp from '../Exp'
import Det from './Det'
import Adj from './Adj'

export default class NP extends Exp {
  det:   Det | null
  adjs:  Array<Adj>
  parts: Array<any> // should be just N, NP, or PrepP

  constructor(args:{|
    expId: number,
    det:   Det | null,
    adjs:  Array<Adj>,
    parts: Array<any>,
  |}) {
    super('NP', args.expId)
    this.det   = args.det
    this.adjs  = args.adjs
    this.parts = args.parts
  }

  toEs(): string {
    return (this.det === null ? [] : [this.det.toEs()])
      .concat(this.adjs.map(n => n.toEs()))
      .concat(this.parts.map(n => n.toEs()))
      .join(' ')
  }

  toMorphemes(): Array<string> {
    let morphemes = this.det === null ? [] : this.det.toMorphemes()
    for (const part of this.adjs.concat(this.parts)) {
      morphemes = morphemes.concat(part.toMorphemes())
    }
    return morphemes
  }

  subExps(): Array<Exp> {
    if (this.det === null &&
        this.adjs.length == 0 &&
        this.parts.length === 1){
      return this.parts[0].subExps()
    } else {
      let exps = [this]
      exps = exps.concat(this.det === null ? [] : this.det.subExps())
      for (const part of this.adjs.concat(this.parts)) {
        exps = exps.concat(part.subExps())
      }
      return exps
    }
  }
}