import Exp from '../Exp'
import Det from './Det'

export default class NP extends Exp {
  det:   Det | null
  parts: Array<any> // should be just N, NP, or PrepP

  constructor(args:{|
    expId: number,
    det:   Det | null,
    parts: Array<any>,
  |}) {
    super('NP', args.expId)
    this.det   = args.det
    this.parts = args.parts
  }

  toEs(): string {
    return (this.det === null ? [] : [this.det.toEs()])
      .concat(this.parts.map(n => n.toEs()))
      .join(' ')
  }

  toMorphemes(): Array<string> {
    let morphemes = this.det === null ? [] : this.det.toMorphemes()
    for (const part of this.parts) {
      morphemes = morphemes.concat(part.toMorphemes())
    }
    return morphemes
  }

  subExps(): Array<Exp> {
    if (this.det === null && this.parts.length === 1){
      return this.parts[0].subExps()
    } else {
      let exps = [this]
      exps = exps.concat(this.det === null ? [] : this.det.subExps())
      for (const part of this.parts) {
        exps = exps.concat(part.subExps())
      }
      return exps
    }
  }
}