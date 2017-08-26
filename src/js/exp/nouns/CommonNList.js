import CommonN from './CommonN'
import {F, M} from './Gender'
import ExpIdSeq from '../ExpIdSeq'

export default class CommonNList {
  list: Array<CommonN>
  byEs: {[string]: CommonN}

  constructor(expIdSeq: ExpIdSeq) {
    const id = () => { return expIdSeq.getNextId() }
    this.list = [
      new CommonN(id(), 'man', 'hombre', M),
      new CommonN(id(), 'woman', 'mujer', F),
    ]

    this.byEs = {}
    for (const n of this.list) {
      const key = n.es
      if (this.byEs[key]) throw new Error(`Collision with ${key}`)
      this.byEs[key] = n
    }
  }

  find(es: string): CommonN {
    return this.byEs[es] || null
  }
}