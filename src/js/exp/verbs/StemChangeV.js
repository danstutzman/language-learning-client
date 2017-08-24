import StemChange from './StemChange'
import RegVPattern from './RegVPattern'
import Exp from '../Exp'

export default class StemChangeV extends Exp {
  stemChange: StemChange
  pattern:    RegVPattern

  constructor(args: {|
    expId:      number,
    stemChange: StemChange,
    pattern:    RegVPattern
  |}) {
    super(args.expId)
    this.stemChange = args.stemChange
    this.pattern    = args.pattern
  }

  toEs(): string {
    const stem = this.stemChange.stem
    return stem.substring(0, stem.length - 1) +
      this.pattern.suffix.substring(1)
  }

  toMorphemes(): Array<string> {
    return [this.stemChange.stem, this.pattern.suffix]
  }

  subExps(): Array<Exp> {
    return [this]
      .concat(this.stemChange.subExps())
      .concat(this.pattern.subExps())
  }
}