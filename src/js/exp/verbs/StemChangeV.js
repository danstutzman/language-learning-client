import StemChange from './StemChange'
import RegVPattern from './RegVPattern'

export default class StemChangeV {
  expId:      number
  infEs:      string
  stemChange: StemChange
  pattern:    RegVPattern

  constructor(args: {|
    expId:      number,
    infEs:      string,
    stemChange: StemChange,
    pattern:    RegVPattern
  |}) {
    this.expId      = args.expId
    this.infEs      = args.infEs
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
}