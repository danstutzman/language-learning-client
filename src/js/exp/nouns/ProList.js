import ExpIdSeq from '../ExpIdSeq'
import Pro from './Pro'
import {DIRECT_OBJECT_PRONOUN, OTHER_PRONOUN, QUESTION_WORD, RELATIVE_PRONOUN} from './ProType'

export default class ProList {
  list: Array<Pro>
  byEs: {[string]: Pro}

  constructor(expIdSeq: ExpIdSeq) {
    const id = () => { return expIdSeq.getNextId() }
    this.list = [
      new Pro(id(), 'I',     'yo',    OTHER_PRONOUN),
      new Pro(id(), 'him',   'lo',    DIRECT_OBJECT_PRONOUN),
      new Pro(id(), 'her',   'la',    DIRECT_OBJECT_PRONOUN),
      new Pro(id(), 'you',   'te',    DIRECT_OBJECT_PRONOUN),
      new Pro(id(), 'where', 'dónde', QUESTION_WORD),
      new Pro(id(), 'where', 'donde', RELATIVE_PRONOUN),
      new Pro(id(), 'how',   'cómo',  QUESTION_WORD),
      new Pro(id(), 'how',   'como',  RELATIVE_PRONOUN)
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