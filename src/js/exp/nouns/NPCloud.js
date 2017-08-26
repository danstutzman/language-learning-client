import NP from './NP'
import DetList from './DetList'
import CommonNList from './CommonNList'
import Det from './Det'
import ExpIdSeq from '../ExpIdSeq'
import ProperN from './ProperN'
import type {N} from './N'
import ProList from './ProList'

export default class NPCloud {
  expIdSeq:    ExpIdSeq
  detList:     DetList
  proList:     ProList
  commonNList: CommonNList

  constructor(expIdSeq: ExpIdSeq) {
    this.expIdSeq = expIdSeq
    this.detList = new DetList(expIdSeq)
    this.proList = new ProList(expIdSeq)
    this.commonNList = new CommonNList(expIdSeq)
  }

  findByEs(es: string): NP {
    let esWords = es.split(' ')

    let det: Det | null = this.detList.find(esWords[0])
    if (det != null) {
      esWords = esWords.slice(1)
    }

    const nouns: Array<N> = esWords.map(esWord => {
      if (this._isTitleCase(esWord)) {
        return new ProperN(this.expIdSeq.getNextId(), esWord, esWord)
      }

      const pro = this.proList.find(esWord)
      if (pro) return pro

      const commonN = this.commonNList.find(esWord)
      if (commonN) return commonN

      throw new Error(`Can't find ${esWord}`)
    })

    return new NP(this.expIdSeq.getNextId(), det, nouns)
  }

  _isTitleCase(word: string) {
    const char = word.charAt(0)
    return char === char.toUpperCase()
  }
}