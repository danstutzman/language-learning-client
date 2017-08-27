import {PRES, PRET} from './Tense'
import type {Tense} from './Tense'
import StemChange from './StemChange'
import ExpIdSeq from '../ExpIdSeq'
import InfList from './InfList'

export default class StemChangeList {
  list: Array<StemChange>
  byInfinitiveTense: {[string]: StemChange}

  constructor(expIdSeq: ExpIdSeq, infList:InfList) {
    const make = (tense: Tense, infEs: string, stem: string) => {
      const inf = infList.byEs[infEs]
      if (!inf) throw new Error(`Can't find Inf for ${infEs}`)
      return new StemChange(expIdSeq.getNextId(), tense, inf, stem)
    }
    this.list = [
      make(PRES, "poder",     "pued-"),
      make(PRES, "tener",     "tien-"),
      make(PRES, "querer",    "quier-"),
      make(PRES, "seguir",    "sig-"),
      make(PRES, "encontrar", "encuentr-"),
      make(PRES, "venir",     "vien-"),
      make(PRES, "pensar",    "piens-"),
      make(PRES, "volver",    "vuelv-"),
      make(PRES, "sentir",    "sient-"),
      make(PRES, "contar",    "cuent-"),
      make(PRES, "empezar",   "empiez-"),
      make(PRES, "decir",     "dic-"),
      make(PRES, "recordar",  "recuerd-"),
      make(PRES, "pedir",     "pid-"),
      make(PRES, "entender",  "entiend-"),
      make(PRET, "andar",     "anduv-"),
      make(PRET, "saber",     "sup-"),
      make(PRET, "querer",    "quis-"),
      make(PRET, "poner",     "pus-"),
      make(PRET, "venir",     "vin-"),
      make(PRET, "decir",     "dij-"),
      make(PRET, "tener",     "tuv-"),
      make(PRET, "hacer",     "hic-"),
      make(PRET, "poder",     "pud-")
    ]

    this.byInfinitiveTense = {}
    for (const stemChange of this.list) {
      const key = `${stemChange.tense}-${stemChange.inf.es}`
      if (this.byInfinitiveTense[key]) throw new Error(`Collision with ${key}`)
      this.byInfinitiveTense[key] = stemChange
    }
  }

  find(infEs: string, tense: Tense): StemChange | null {
    const key = `${tense}-${infEs}`
    return this.byInfinitiveTense[key] || null
  }
}