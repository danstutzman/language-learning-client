import {F, M} from './Gender'
import ExpIdSeq from '../ExpIdSeq'
import Det from './Det'

export default class DetList {
  list: Array<Det>
  byEs: {[string]: Det}

  constructor(expIdSeq: ExpIdSeq) {
    const id = () => { return expIdSeq.getNextId() }
    this.list = [
      new Det(id(), 'un', 'a', M),
      new Det(id(), 'una', 'a', F),
    ]

    this.byEs = {}
    for (const n of this.list) {
      const key = n.es
      if (this.byEs[key]) throw new Error(`Collision with ${key}`)
      this.byEs[key] = n
    }
  }

  find(es: string): Det | null {
    return this.byEs[es] || null
  }
}