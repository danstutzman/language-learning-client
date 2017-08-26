import Exp from '../Exp'
import Prep from './Prep'
import NP from './NP'

export default class PrepP extends Exp {
  prep: Prep
  np:   NP

  constructor(args:{|
    expId: number,
    prep:  Prep,
    np:    NP,
  |}) {
    super('PrepP', args.expId)
    this.prep = args.prep
    this.np   = args.np
  }

  toEs(): string {
    return this.prep.toEs() + ' ' + this.np.toEs()
  }

  toMorphemes(): Array<string> {
    return this.prep.toMorphemes()
      .concat(this.np.toMorphemes())
  }

  subExps(): Array<Exp> {
    return [this]
      .concat(this.prep.subExps())
      .concat(this.np.subExps())
  }
}