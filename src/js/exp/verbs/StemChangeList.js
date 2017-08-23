import {PRES, PRET} from './Tense'
import type {Tense} from './Tense'
import StemChange from './StemChange'
import ExpIdSeq from '../ExpIdSeq'

export default class StemChangeList {
  list: Array<StemChange>
  byInfinitiveTense: {[string]: StemChange}

  constructor(expIdSeq: ExpIdSeq) {
    const id = () => { return expIdSeq.getNextId() }
    this.list = [
      new StemChange(id(), PRES, "poder",     "pued-"),
      new StemChange(id(), PRES, "tener",     "tien-"),
      new StemChange(id(), PRES, "querer",    "quier-"),
      new StemChange(id(), PRES, "seguir",    "sig-"),
      new StemChange(id(), PRES, "encontrar", "encuentr-"),
      new StemChange(id(), PRES, "venir",     "vien-"),
      new StemChange(id(), PRES, "pensar",    "piens-"),
      new StemChange(id(), PRES, "volver",    "vuelv-"),
      new StemChange(id(), PRES, "sentir",    "sient-"),
      new StemChange(id(), PRES, "contar",    "cuent-"),
      new StemChange(id(), PRES, "empezar",   "empiez-"),
      new StemChange(id(), PRES, "decir",     "dic-"),
      new StemChange(id(), PRES, "recordar",  "recuerd-"),
      new StemChange(id(), PRES, "pedir",     "pid-"),
      new StemChange(id(), PRET, "andar",     "anduv-"),
      new StemChange(id(), PRET, "saber",     "sup-"),
      new StemChange(id(), PRET, "querer",    "quis-"),
      new StemChange(id(), PRET, "poner",     "pus-"),
      new StemChange(id(), PRET, "venir",     "vin-"),
      new StemChange(id(), PRET, "decir",     "dij-"),
      new StemChange(id(), PRET, "tener",     "tuv-"),
      new StemChange(id(), PRET, "hacer",     "hic-"),
      new StemChange(id(), PRET, "poder",     "pud-")
    ]

    this.byInfinitiveTense = {}
    for (const stemChange of this.list) {
      const key = `${stemChange.tense}-${stemChange.infEs}`
      if (this.byInfinitiveTense[key]) throw new Error(`Collision with ${key}`)
      this.byInfinitiveTense[key] = stemChange
    }
  }

  find(infEs: string, tense: Tense): StemChange | null {
    const key = `${tense}-${infEs}`
    return this.byInfinitiveTense[key] || null
  }
}