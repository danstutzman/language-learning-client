import Exp from '../Exp'
import NP from '../nouns/NP'
import type {V} from '../verbs/V'

// VC stands for verb clause, e.g. 'I go'
export default class VC extends Exp {
  agent:     NP | null
  // ioPro: Pronoun | null
  // doPro: Pronoun|void
  v:         V
  io:        NP | null // indirect object
  do:        NP | null // direct object
  negative:  bool
  verbFirst: bool

  constructor(args:{|
    expId:     number,
    agent:     NP,
    // ioPro: EsPronoun|void,
    // doPro:   EsPronoun|void,
    v:         V,
    io?:       NP | null,
    do?:       NP | null,
    negative?: bool,
  |}) {
    super(args.expId)
    this.agent           = args.agent
    // this.indirectPronoun = args.indirectPronoun
    // this.directPronoun   = args.directPronoun
    this.v        = args.v
    this.io       = args.io || null
    this.do       = args.do || null
    this.negative = args.negative || false
  }

  toEs(): string {
    return []
      .concat(!this.verbFirst && this.agent ? [this.agent.toEs()] : [])
      .concat(this.negative ? ['no'] : [])
      .concat([this.v.toEs()])
      .concat(this.verbFirst && this.agent ? [this.agent.toEs()] : [])
      .concat(this.io ? [this.io.toEs()] : [])
      .concat(this.do ? [this.do.toEs()] : [])
      .join(' ')
  }

  toMorphemes(): Array<string> {
    return []
      .concat(!this.verbFirst && this.agent ? this.agent.toMorphemes() : [])
      .concat(this.negative ? ['no'] : [])
      .concat(this.v.toMorphemes())
      .concat(this.verbFirst && this.agent ? this.agent.toMorphemes() : [])
      .concat(this.io ? this.io.toMorphemes() : [])
      .concat(this.do ? this.do.toMorphemes() : [])
  }

  subExps() : Array<Exp> {
    return [this]
      .concat(!this.verbFirst && this.agent ? this.agent.subExps() : [])
      .concat(this.v.subExps())
      .concat(this.verbFirst && this.agent ? this.agent.subExps() : [])
      .concat(this.io ? this.io.subExps() : [])
      .concat(this.do ? this.do.subExps() : [])
  }
}