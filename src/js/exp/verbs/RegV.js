import RegVPattern from './RegVPattern'

export default class RegV {
  infEs:   string
  pattern: RegVPattern

  constructor(args:{|
    infEs:   string,
    pattern: RegVPattern
  |}) {
    this.infEs   = args.infEs
    this.pattern = args.pattern
  }

  toMorphemes(): Array<string> {
    const stem = this.infEs.substring(0, this.infEs.length - 2)
    return [stem + '-', this.pattern.suffix]
  }
}