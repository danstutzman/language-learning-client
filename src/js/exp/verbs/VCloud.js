import RegVPatternList from './RegVPatternList'
import RegV from './RegV'
import type {Number} from './Number'
import type {Tense} from './Tense'
import type {Person} from './Person'
import StemChangeList from './StemChangeList'
import {PRES, PRET} from './Tense'
import {P} from './Number'
import StemChangeV from './StemChangeV'
import type {V} from './V'
import UniqVList from './UniqVList'
import ExpIdSeq from '../ExpIdSeq'

export default class VCloud {
  expIdSeq: ExpIdSeq
  regVPatternList: RegVPatternList
  stemChangeList: StemChangeList
  uniqVList: UniqVList

  constructor(expIdSeq: ExpIdSeq) {
    this.expIdSeq        = expIdSeq
    this.regVPatternList = new RegVPatternList(expIdSeq)
    this.stemChangeList  = new StemChangeList(expIdSeq)
    this.uniqVList       = new UniqVList(expIdSeq)
  }

  conjugate(infEs:string, tense:Tense, person:Person, number:Number): V {
    const uniqV = this.uniqVList.find(
      infEs, tense, person, number)
    if (uniqV) {
      return uniqV
    }

    const stemChange = this.stemChangeList.find(infEs, tense)
    if (stemChange && !(tense === PRES && person === 1 && number === P)) {
      const pattern = this.regVPatternList.find(
        infEs, tense, person, number, tense === PRET)
      if (pattern) {
        const expId = this.expIdSeq.getNextId()
        return new StemChangeV({ expId, infEs, stemChange, pattern })
      } else {
        throw new Error(`Can't find RegVPattern for stem-changing
          ${infEs}.${tense}.${person}.${number}`)
      }
    }

    const pattern = this.regVPatternList.find(infEs, tense, person, number, false)
    if (pattern) {
      const expId = this.expIdSeq.getNextId()
      return new RegV({ expId, infEs, pattern })
    } else {
      throw new Error(`Can't find UniqV or RegV for
        ${infEs}.${tense}.${person}.${number}`)
    }
  }
}