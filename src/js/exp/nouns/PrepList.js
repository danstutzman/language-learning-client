import ExpIdSeq from '../ExpIdSeq'
import Prep from './Prep'

export default class PrepList {
  list: Array<Prep>
  byEs: {[string]: Prep}

  constructor(expIdSeq: ExpIdSeq) {
    const id = () => { return expIdSeq.getNextId() }
    this.list = [
      new Prep(id(), 'of', 'de'),
    ]

    this.byEs = {}
    for (const n of this.list) {
      const key = n.es
      if (this.byEs[key]) throw new Error(`Collision with ${key}`)
      this.byEs[key] = n
    }
  }

  findByEs(es: string): Prep | null {
    return this.byEs[es] || null
  }
}