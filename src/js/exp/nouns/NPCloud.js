import NP from './NP'
import DetList from './DetList'
import CommonNList from './CommonNList'
import Det from './Det'
import CommonN from './CommonN'
import ExpIdSeq from '../ExpIdSeq'

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

    const nouns: Array<CommonN> = esWords.map(esWord => {
      const n = this.commonNList.find(esWord)
      if (!n) throw new Error(`Can't find ${esWord}`)
      return n
    })

    return new NP(this.expIdSeq.getNextId(), det, nouns)
  }
}