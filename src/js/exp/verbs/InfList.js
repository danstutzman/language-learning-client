import ExpIdSeq from '../ExpIdSeq'
import Inf from './Inf'

export default class InfList {
  list: Array<Inf>
  byEs: {[string]: Inf}

  constructor(expIdSeq: ExpIdSeq) {
    const id = () => { return expIdSeq.getNextId() }
    this.list = [
      new Inf(id(), 'want', 'querer'),
      new Inf(id(), 'need', 'necesitar'),
      new Inf(id(), 'have', 'tener'),
      new Inf(id(), 'give', 'dar'),
      new Inf(id(), 'tell', 'decir'),
      new Inf(id(), 'ask', 'preguntar'),
      new Inf(id(), 'command', 'ordenar'),
      new Inf(id(), 'eat', 'comer'), // need a regular -er
    ]

    this.byEs = {}
    for (const inf of this.list) {
      const key = inf.es
      if (this.byEs[key]) throw new Error(`Collision with ${key}`)
      this.byEs[key] = inf
    }
  }
}