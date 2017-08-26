import RegVPattern from './RegVPattern'
import Inf from './Inf'
import Exp from '../Exp'

export default class RegV extends Exp {
  inf:     Inf
  pattern: RegVPattern

  constructor(args:{|
    expId:   number,
    inf:     Inf,
    pattern: RegVPattern
  |}) {
    super('RegV', args.expId)
    this.inf     = args.inf
    this.pattern = args.pattern
  }

  toEs(): string {
    const es = this.inf.es
    const stem = es.substring(0, es.length - 2)
    return stem + this.pattern.suffix.substring(1)
  }

  toMorphemes(): Array<string> {
    const es = this.inf.es
    const stem = es.substring(0, es.length - 2)
    return [stem + '-', this.pattern.suffix]
  }

  subExps(): Array<Exp> {
    return [this]
      .concat(this.inf.subExps())
      .concat(this.pattern.subExps())
  }
}