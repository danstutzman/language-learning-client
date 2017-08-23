import RegVPattern from './RegVPattern'
import {isInfCategory,AR,ER,IR,ERIR,STEMPRET} from './InfCategory'
import {PRES,PRET} from './Tense'
import {S,P} from './Number'
import type {Number} from './Number'
import type {Tense} from './Tense'
import type {Person} from './Person'

export default class RegVPatternList {
  list: Array<RegVPattern>

  constructor() {
    this.list = [
      new RegVPattern(AR,       PRES, 1, S, "-o"),
      new RegVPattern(AR,       PRES, 2, S, "-as"),
      new RegVPattern(AR,       PRES, 3, S, "-a"),
      new RegVPattern(AR,       PRES, 1, P, "-amos"),
      new RegVPattern(AR,       PRES, 3, P, "-an"),
      new RegVPattern(AR,       PRET, 1, S, "-é"),
      new RegVPattern(AR,       PRET, 2, S, "-aste"),
      new RegVPattern(AR,       PRET, 3, S, "-ó"),
      new RegVPattern(AR,       PRET, 1, P, "-amos"),
      new RegVPattern(AR,       PRET, 3, P, "-aron"),
      new RegVPattern(ERIR,     PRES, 1, S, "-o"),
      new RegVPattern(ERIR,     PRES, 2, S, "-es"),
      new RegVPattern(ERIR,     PRES, 3, S, "-e"),
      new RegVPattern(ERIR,     PRES, 3, P, "-en"),
      new RegVPattern(ERIR,     PRET, 1, S, "-í"),
      new RegVPattern(ERIR,     PRET, 2, S, "-iste"),
      new RegVPattern(ERIR,     PRET, 3, S, "-ió"),
      new RegVPattern(ERIR,     PRET, 1, P, "-imos"),
      new RegVPattern(ERIR,     PRET, 3, P, "-ieron"),
      new RegVPattern(ER,       PRES, 1, P, "-emos"),
      new RegVPattern(IR,       PRES, 1, P, "-imos"),
      new RegVPattern(STEMPRET, PRET, 1, S, "-e"),
      new RegVPattern(STEMPRET, PRET, 2, S, "-iste"),
      new RegVPattern(STEMPRET, PRET, 3, S, "-o"),
      new RegVPattern(STEMPRET, PRET, 1, P, "-imos"),
      new RegVPattern(STEMPRET, PRET, 3, P, "-ieron")
    ]
  }

  find(infEs: string, tense: Tense, person: Person, number: Number,
       isStemChangePret: boolean): RegVPattern | null {
    const patterns = []
    for (const pattern of this.list) {
      if (isInfCategory(infEs, pattern.infCategory, isStemChangePret) &&
        pattern.tense === tense &&
        pattern.person === person &&
        pattern.number === number) {
        patterns.push(pattern)
      }
    }
    if (patterns.length > 1) {
      throw new Error(
        `Found >1 RegularVPattern for ${tense}${person}${number}`)
    }
    return patterns[0] || null
  }
}