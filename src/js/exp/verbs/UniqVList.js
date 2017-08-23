import {P, S} from './Number'
import {PRES, PRET} from './Tense'
import UniqV from './UniqV'
import type {Person} from './Person'
import type {Tense} from './Tense'
import type {Number} from './Number'

export default class UniqVList {
  list: Array<UniqV>
  byInfTensePersonNumber: {[string]: UniqV}

  constructor() {
    this.list = [
      new UniqV("ser",     PRES, 1, S, "soy"),
      new UniqV("ser",     PRES, 2, S, "eres"),
      new UniqV("ser",     PRES, 3, S, "es"),
      new UniqV("ser",     PRES, 1, P, "somos"),
      new UniqV("ser",     PRES, 3, P, "son"),
      new UniqV("ser",     PRET, 1, S, "fui"),
      new UniqV("ser",     PRET, 2, S, "fuiste"),
      new UniqV("ser",     PRET, 3, S, "fue"),
      new UniqV("ser",     PRET, 1, P, "fuimos"),
      new UniqV("ser",     PRET, 3, P, "fueron"),
      new UniqV("estar",   PRES, 1, S, "estoy"),
      new UniqV("estar",   PRES, 2, S, "estás"),
      new UniqV("estar",   PRES, 3, S, "está"),
      new UniqV("estar",   PRES, 3, P, "están"),
      new UniqV("tener",   PRES, 1, S, "tengo"),
      new UniqV("hacer",   PRES, 1, S, "hago"),
      new UniqV("decir",   PRES, 1, S, "digo"),
      new UniqV("decir",   PRET, 3, P, "dijeron"),
      new UniqV("ir",      PRES, 1, S, "voy"),
      new UniqV("ir",      PRES, 2, S, "vas"),
      new UniqV("ir",      PRES, 3, S, "va"),
      new UniqV("ir",      PRES, 1, P, "vamos"),
      new UniqV("ir",      PRES, 3, P, "van"),
      new UniqV("ir",      PRET, 1, S, "fui"),
      new UniqV("ir",      PRET, 2, S, "fuiste"),
      new UniqV("ir",      PRET, 3, S, "fue"),
      new UniqV("ir",      PRET, 1, P, "fuimos"),
      new UniqV("ir",      PRET, 3, P, "fueron"),
      new UniqV("ver",     PRES, 1, S, "veo"),
      new UniqV("ver",     PRET, 1, S, "vi"),
      new UniqV("ver",     PRET, 3, S, "vio"),
      new UniqV("ver",     PRET, 1, P, "vimos"),
      new UniqV("dar",     PRES, 1, S, "doy"),
      new UniqV("dar",     PRET, 1, S, "di"),
      new UniqV("dar",     PRET, 2, S, "diste"),
      new UniqV("dar",     PRET, 3, S, "dio"),
      new UniqV("dar",     PRET, 1, P, "dimos"),
      new UniqV("dar",     PRET, 3, P, "dieron"),
      new UniqV("saber",   PRES, 1, S, "sé"),
      new UniqV("poner",   PRES, 1, S, "pongo"),
      new UniqV("venir",   PRES, 1, S, "vengo"),
      new UniqV("salir",   PRES, 1, S, "salgo"),
      new UniqV("parecer", PRES, 1, S, "parezco"),
      new UniqV("conocer", PRES, 1, S, "conozco"),
      new UniqV("empezar", PRET, 1, S, "empecé"),
      new UniqV("enviar",  PRES, 1, S, "envío"),
      new UniqV("enviar",  PRES, 2, S, "envías"),
      new UniqV("enviar",  PRES, 3, S, "envía"),
      new UniqV("enviar",  PRES, 1, P, "envían")
    ]

    this.byInfTensePersonNumber = {}
    for (const v of this.list) {
      const key =`${v.infEs}-${v.tense}${v.person}${v.number}`
      this.byInfTensePersonNumber[key] = v
    }
  }

  find(infEs:string, tense:Tense, person:Person, number:Number): UniqV | null {
    const key =`${infEs}-${tense}${person}${number}`
    return this.byInfTensePersonNumber[key]
  }
}