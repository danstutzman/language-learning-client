import NP from './NP'
import DetList from './DetList'
import CommonNList from './CommonNList'
import Det from './Det'
import CommonN from './CommonN'
import ExpIdSeq from '../ExpIdSeq'
import ProperN from './ProperN'
import type {N} from './N'

export default class NPCloud {
  expIdSeq:    ExpIdSeq
  detList:     DetList
  commonNList: CommonNList

  constructor(expIdSeq: ExpIdSeq) {
    this.expIdSeq = expIdSeq
    this.detList = new DetList(expIdSeq)
    this.commonNList = new CommonNList(expIdSeq)
  }

  findByEs(es: string): NP {
    let esWords = es.split(' ')

    let det: Det | null = this.detList.find(esWords[0])
    if (det != null) {
      esWords = esWords.slice(1)
    }

    const nouns: Array<N> = esWords.map(esWord => {
      const n = this._isTitleCase(esWord) ?
        new ProperN(this.expIdSeq.getNextId(), esWord, esWord) :
        this.commonNList.find(esWord)
      if (!n) throw new Error(`Can't find ${esWord}`)
      return n
    })

    return new NP(this.expIdSeq.getNextId(), det, nouns)
  }

  _isTitleCase(word: string) {
    const char = word.charAt(0)
    return char === char.toUpperCase()
  }
}