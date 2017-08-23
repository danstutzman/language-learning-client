import StemChange from './StemChange'
import RegVPattern from './RegVPattern'

export default class StemChangeV {
  infEs:      string
  stemChange: StemChange
  pattern:    RegVPattern

  constructor(args: {|
    infEs:      string,
    stemChange: StemChange,
    pattern:    RegVPattern
  |}) {
    this.infEs      = args.infEs
    this.stemChange = args.stemChange
    this.pattern    = args.pattern
  }

  toMorphemes(): Array<string> {
    return [this.stemChange.stem, this.pattern.suffix]
  }
}