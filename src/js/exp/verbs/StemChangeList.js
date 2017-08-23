import {PRES, PRET} from './Tense'
import type {Tense} from './Tense'
import StemChange from './StemChange'

export default class StemChangeList {
  list: Array<StemChange>
  byInfinitiveTense: {[string]: StemChange}

  constructor() {
    this.list = [
      new StemChange(PRES, "poder",     "pued-"),
      new StemChange(PRES, "tener",     "tien-"),
      new StemChange(PRES, "querer",    "quier-"),
      new StemChange(PRES, "seguir",    "sig-"),
      new StemChange(PRES, "encontrar", "encuentr-"),
      new StemChange(PRES, "venir",     "vien-"),
      new StemChange(PRES, "pensar",    "piens-"),
      new StemChange(PRES, "volver",    "vuelv-"),
      new StemChange(PRES, "sentir",    "sient-"),
      new StemChange(PRES, "contar",    "cuent-"),
      new StemChange(PRES, "empezar",   "empiez-"),
      new StemChange(PRES, "decir",     "dic-"),
      new StemChange(PRES, "recordar",  "recuerd-"),
      new StemChange(PRES, "pedir",     "pid-"),
      new StemChange(PRET, "andar",     "anduv-"),
      new StemChange(PRET, "saber",     "sup-"),
      new StemChange(PRET, "querer",    "quis-"),
      new StemChange(PRET, "poner",     "pus-"),
      new StemChange(PRET, "venir",     "vin-"),
      new StemChange(PRET, "decir",     "dij-"),
      new StemChange(PRET, "tener",     "tuv-"),
      new StemChange(PRET, "hacer",     "hic-"),
      new StemChange(PRET, "poder",     "pud-")
    ]

    this.byInfinitiveTense = {}
    for (const stemChange of this.list) {
      const key = `${stemChange.tense}-${stemChange.infEs}`
      this.byInfinitiveTense[key] = stemChange
    }
  }

  find(infEs: string, tense: Tense): StemChange | null {
    const key = `${tense}-${infEs}`
    return this.byInfinitiveTense[key] || null
  }
}