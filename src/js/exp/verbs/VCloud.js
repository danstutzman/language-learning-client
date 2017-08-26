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
import {isInfCategory} from './InfCategory'
import InfList from './InfList'
import Inf from './Inf'

export default class VCloud {
  expIdSeq: ExpIdSeq
  infList: InfList
  regVPatternList: RegVPatternList
  stemChangeList: StemChangeList
  uniqVList: UniqVList
  memoryByV: { [string]: V } // so as not to repeat expIds

  constructor(expIdSeq: ExpIdSeq) {
    this.expIdSeq = expIdSeq
    this.infList = new InfList(expIdSeq)
    this.regVPatternList = new RegVPatternList(expIdSeq)
    this.stemChangeList = new StemChangeList(expIdSeq, this.infList)
    this.uniqVList = new UniqVList(expIdSeq, this.infList)
    this.memoryByV = {}
  }

  conjugate(inf:Inf, tense:Tense, person:Person, number:Number): V {
    const uniqV = this.uniqVList.find(inf.es, tense, person, number)
    if (uniqV) return uniqV

    const stemChange = this.stemChangeList.find(inf.es, tense)
    if (stemChange && !(tense === PRES && person === 1 && number === P)) {
      const pattern = this.regVPatternList.find(
        inf.es, tense, person, number, tense === PRET)
      if (pattern) {
        const expId = this.expIdSeq.getNextId()
        return this._remembered(null,
          new StemChangeV({expId, stemChange, pattern}))
      } else {
        throw new Error(`Can't find RegVPattern for stem-changing
          ${inf.es}.${tense}.${person}.${number}`)
      }
    }

    const pattern =
      this.regVPatternList.find(inf.es, tense, person, number, false)
    if (pattern) {
      const expId = this.expIdSeq.getNextId()
      return this._remembered(null, new RegV({expId, inf, pattern}))
    } else {
      throw new Error(`Can't find UniqV or RegV for
        ${inf.es}.${tense}.${person}.${number}`)
    }
  }

  findByEs(mysteryEs: string): V {
    const rememberedV = this.memoryByV[mysteryEs]
    if (rememberedV) return rememberedV

    const results: Array<V> = []

    // Look for UniqV
    const uniqV = this.uniqVList.findByEs(mysteryEs)
    if (uniqV) return uniqV

    // Look for Inf
    const inf = this.infList.byEs[mysteryEs]
    if (inf) return inf

    // Look for RegV
    const possibleInfs = []
    for (const inf of this.infList.list) {
      const base = inf.es.substring(0, inf.es.length - 2)
      if (mysteryEs.startsWith(base)) {
        possibleInfs.push(inf)
      }
    }
    const possiblePatterns = []
    for (const pattern of this.regVPatternList.list) {
      const ending = pattern.suffix.substring(1)
      if (mysteryEs.endsWith(ending)) {
        possiblePatterns.push(pattern)
      }
    }
    for (const inf of possibleInfs) {
      for (const pattern of possiblePatterns) {
        if (isInfCategory(inf.es, pattern.infCategory, false)) {
          const expId = this.expIdSeq.getNextId()
          const newV = new RegV({expId, inf, pattern})
          if (newV.toEs() === mysteryEs) {
            results.push(newV)
          }
        }
      }
    }

    // Look for StemChangeV
    for (const stemChange of this.stemChangeList.list) {
      const base = stemChange.stem.substring(0, stemChange.stem.length - 1)
      if (mysteryEs.startsWith(base)) {
        for (const pattern of possiblePatterns) {
          if (pattern.tense === stemChange.tense && isInfCategory(
              stemChange.inf.es, pattern.infCategory, pattern.tense === PRET)) {
            const expId = this.expIdSeq.getNextId()
            results.push(new StemChangeV({expId, stemChange, pattern}))
          }
        }
      }
    }

    if (results.length === 0) {
      throw new Error(`Can't find mystery verb ${mysteryEs}`)
    } else if (results.length > 1) {
      throw new Error(`Found ${JSON.stringify(results)} for ${mysteryEs}`)
    } else {
      return this._remembered(mysteryEs, results[0])
    }
  }

  _remembered(expectedEs: string | null, newV: V): V {
    const es = newV.toEs()
    if (expectedEs && es !== expectedEs) {
      throw new Error(`Expected ${expectedEs} but got ${es
        } from ${JSON.stringify(newV)}`)
    }

    const oldV = this.memoryByV[es]
    if (oldV) {
      return oldV
    } else {
      this.memoryByV[es] = newV
      return newV
    }
  }
}