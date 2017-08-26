import ExpIdSeq from '../ExpIdSeq'
import Pro from './Pro'

export default class ProList {
  list: Array<Pro>
  byEs: {[string]: Pro}

  constructor(expIdSeq: ExpIdSeq) {
    const id = () => { return expIdSeq.getNextId() }
    this.list = [
      new Pro(id(), 'I', 'yo'),
      new Pro(id(), 'him', 'lo'),
      new Pro(id(), 'her', 'la'),
    ]

    this.byEs = {}
    for (const n of this.list) {
      const key = n.es
      if (this.byEs[key]) throw new Error(`Collision with ${key}`)
      this.byEs[key] = n
    }
  }

  find(es: string): Pro | null {
    return this.byEs[es] || null
  }
}