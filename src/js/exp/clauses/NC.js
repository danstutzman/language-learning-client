import Exp from '../Exp'
import Pro from '../nouns/Pro'
import VC from './VC'

// NC stands for noun clause, e.g. 'who goes'
export default class NC extends Exp {
  pro: Pro
  vc:  VC

  constructor(args:{|
    expId: number,
    pro:   Pro,
    vc:    VC,
  |}) {
    super(args.expId)
    this.pro = args.pro
    this.vc  = args.vc
  }

  toEs(): string {
    return this.pro.toEs() + ' ' + this.vc.toEs()
  }

  toMorphemes(): Array<string> {
    return this.pro.toMorphemes()
      .concat(this.vc.toMorphemes())
  }

  subExps() : Array<Exp> {
    return [this]
      .concat(this.pro.subExps())
      .concat(this.vc.subExps())
  }
}