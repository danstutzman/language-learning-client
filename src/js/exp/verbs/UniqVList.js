import {P, S} from './Number'
import {PRES, PRET} from './Tense'
import UniqV from './UniqV'
import type {Person} from './Person'
import type {Tense} from './Tense'
import type {Number} from './Number'
import ExpIdSeq from '../ExpIdSeq'
import InfList from './InfList'

export default class UniqVList {
  list: Array<UniqV>
  byInfTensePersonNumber: {[string]: UniqV}
  byEs: {[string]: UniqV}

  constructor(expIdSeq: ExpIdSeq, infList:InfList) {
    const make = (infEs:string, tense:Tense, person:Person, number:Number,
                  es:string) => {
        const inf = infList.byEs[infEs]
        if (!inf) throw new Error(`Can't find Inf for ${infEs}`)
        return new UniqV(expIdSeq.getNextId(),
          inf, tense, person, number, es)
      }
    this.list = [
      make("ser",     PRES, 1, S, "soy"),
      make("ser",     PRES, 2, S, "eres"),
      make("ser",     PRES, 3, S, "es"),
      make("ser",     PRES, 1, P, "somos"),
      make("ser",     PRES, 3, P, "son"),
      make("ser",     PRET, 1, S, "fui"),
      make("ser",     PRET, 2, S, "fuiste"),
      make("ser",     PRET, 3, S, "fue"),
      make("ser",     PRET, 1, P, "fuimos"),
      make("ser",     PRET, 3, P, "fueron"),
      make("estar",   PRES, 1, S, "estoy"),
      make("estar",   PRES, 2, S, "estás"),
      make("estar",   PRES, 3, S, "está"),
      make("estar",   PRES, 3, P, "están"),
      make("tener",   PRES, 1, S, "tengo"),
      make("hacer",   PRES, 1, S, "hago"),
      make("decir",   PRES, 1, S, "digo"),
      make("decir",   PRET, 3, P, "dijeron"),
      make("ir",      PRES, 1, S, "voy"),
      make("ir",      PRES, 2, S, "vas"),
      make("ir",      PRES, 3, S, "va"),
      make("ir",      PRES, 1, P, "vamos"),
      make("ir",      PRES, 3, P, "van"),
      // make("ir",      PRET, 1, S, "fui"),
      // make("ir",      PRET, 2, S, "fuiste"),
      // make("ir",      PRET, 3, S, "fue"),
      // make("ir",      PRET, 1, P, "fuimos"),
      // make("ir",      PRET, 3, P, "fueron"),
      make("ver",     PRES, 1, S, "veo"),
      make("ver",     PRET, 1, S, "vi"),
      make("ver",     PRET, 3, S, "vio"),
      make("ver",     PRET, 1, P, "vimos"),
      make("dar",     PRES, 1, S, "doy"),
      make("dar",     PRET, 1, S, "di"),
      make("dar",     PRET, 2, S, "diste"),
      make("dar",     PRET, 3, S, "dio"),
      make("dar",     PRET, 1, P, "dimos"),
      make("dar",     PRET, 3, P, "dieron"),
      make("saber",   PRES, 1, S, "sé"),
      make("poner",   PRES, 1, S, "pongo"),
      make("venir",   PRES, 1, S, "vengo"),
      make("salir",   PRES, 1, S, "salgo"),
      make("parecer", PRES, 1, S, "parezco"),
      make("conocer", PRES, 1, S, "conozco"),
      make("empezar", PRET, 1, S, "empecé"),
      make("enviar",  PRES, 1, S, "envío"),
      make("enviar",  PRES, 2, S, "envías"),
      make("enviar",  PRES, 3, S, "envía"),
      make("enviar",  PRES, 1, P, "envían")
    ]

    this.byInfTensePersonNumber = {}
    for (const v of this.list) {
      const key =`${v.inf.es}-${v.tense}${v.person}${v.number}`
      if (this.byInfTensePersonNumber[key]) throw new Error(`Collision with ${key}`)
      this.byInfTensePersonNumber[key] = v
    }

    this.byEs = {}
    for (const v of this.list) {
      const key = v.es
      if (this.byEs[key]) throw new Error(`Collision with ${key}`)
      this.byEs[key] = v
    }
   }

  find(infEs:string, tense:Tense, person:Person, number:Number): UniqV | null {
    const key =`${infEs}-${tense}${person}${number}`
    return this.byInfTensePersonNumber[key]
  }

  findByEs(es:string): UniqV | null {
    return this.byEs[es] || null
  }
}
