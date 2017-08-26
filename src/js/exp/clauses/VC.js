import Exp from '../Exp'
import NP from '../nouns/NP'
import type {V} from '../verbs/V'
import Pro from '../nouns/Pro'

// VC stands for verb clause, e.g. 'I go'
export default class VC extends Exp {
  agent:     NP | null
  ioPro:     Pro | null
  doPro:     Pro | null
  v:         V
  io:        NP | null // indirect object
  do:        NP | null // direct object
  negative:  boolean
  verbFirst: boolean

  constructor(args:{|
    expId:      number,
    agent:      NP,
    ioPro?:     Pro,
    doPro?:     Pro,
    v:          V,
    io?:        NP,
    do?:        NP,
    negative?:  boolean,
    verbFirst?: boolean
  |}) {
    super(args.expId)
    this.agent     = args.agent
    this.ioPro     = args.ioPro || null
    this.doPro     = args.doPro || null
    this.v         = args.v
    this.io        = args.io || null
    this.do        = args.do || null
    this.negative  = args.negative || false
    this.verbFirst = args.verbFirst || false
  }

  toEs(): string {
    return []
      .concat(!this.verbFirst && this.agent ? [this.agent.toEs()] : [])
      .concat(this.negative ? ['no'] : [])
      .concat(this.ioPro ? [this.ioPro.toEs()] : [])
      .concat(this.doPro ? [this.doPro.toEs()] : [])
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
      .concat(this.ioPro ? this.ioPro.toMorphemes() : [])
      .concat(this.doPro ? this.doPro.toMorphemes() : [])
      .concat(this.v.toMorphemes())
      .concat(this.verbFirst && this.agent ? this.agent.toMorphemes() : [])
      .concat(this.io ? this.io.toMorphemes() : [])
      .concat(this.do ? this.do.toMorphemes() : [])
  }

  subExps() : Array<Exp> {
    return [this]
      .concat(!this.verbFirst && this.agent ? this.agent.subExps() : [])
      .concat(this.ioPro ? this.ioPro.subExps() : [])
      .concat(this.doPro ? this.doPro.subExps() : [])
      .concat(this.v.subExps())
      .concat(this.verbFirst && this.agent ? this.agent.subExps() : [])
      .concat(this.io ? this.io.subExps() : [])
      .concat(this.do ? this.do.subExps() : [])
  }
}