import {P, S} from './Number'
import {PRES, PRET} from './Tense'
import UniqV from './UniqV'
import type {Person} from './Person'
import type {Tense} from './Tense'
import type {Number} from './Number'
import ExpIdSeq from '../ExpIdSeq'

export default class UniqVList {
  list: Array<UniqV>
  byInfTensePersonNumber: {[string]: UniqV}

  constructor(expIdSeq: ExpIdSeq) {
    const id = () => { return expIdSeq.getNextId() }
    this.list = [
      new UniqV(id(), "ser",     PRES, 1, S, "soy"),
      new UniqV(id(), "ser",     PRES, 2, S, "eres"),
      new UniqV(id(), "ser",     PRES, 3, S, "es"),
      new UniqV(id(), "ser",     PRES, 1, P, "somos"),
      new UniqV(id(), "ser",     PRES, 3, P, "son"),
      new UniqV(id(), "ser",     PRET, 1, S, "fui"),
      new UniqV(id(), "ser",     PRET, 2, S, "fuiste"),
      new UniqV(id(), "ser",     PRET, 3, S, "fue"),
      new UniqV(id(), "ser",     PRET, 1, P, "fuimos"),
      new UniqV(id(), "ser",     PRET, 3, P, "fueron"),
      new UniqV(id(), "estar",   PRES, 1, S, "estoy"),
      new UniqV(id(), "estar",   PRES, 2, S, "estás"),
      new UniqV(id(), "estar",   PRES, 3, S, "está"),
      new UniqV(id(), "estar",   PRES, 3, P, "están"),
      new UniqV(id(), "tener",   PRES, 1, S, "tengo"),
      new UniqV(id(), "hacer",   PRES, 1, S, "hago"),
      new UniqV(id(), "decir",   PRES, 1, S, "digo"),
      new UniqV(id(), "decir",   PRET, 3, P, "dijeron"),
      new UniqV(id(), "ir",      PRES, 1, S, "voy"),
      new UniqV(id(), "ir",      PRES, 2, S, "vas"),
      new UniqV(id(), "ir",      PRES, 3, S, "va"),
      new UniqV(id(), "ir",      PRES, 1, P, "vamos"),
      new UniqV(id(), "ir",      PRES, 3, P, "van"),
      new UniqV(id(), "ir",      PRET, 1, S, "fui"),
      new UniqV(id(), "ir",      PRET, 2, S, "fuiste"),
      new UniqV(id(), "ir",      PRET, 3, S, "fue"),
      new UniqV(id(), "ir",      PRET, 1, P, "fuimos"),
      new UniqV(id(), "ir",      PRET, 3, P, "fueron"),
      new UniqV(id(), "ver",     PRES, 1, S, "veo"),
      new UniqV(id(), "ver",     PRET, 1, S, "vi"),
      new UniqV(id(), "ver",     PRET, 3, S, "vio"),
      new UniqV(id(), "ver",     PRET, 1, P, "vimos"),
      new UniqV(id(), "dar",     PRES, 1, S, "doy"),
      new UniqV(id(), "dar",     PRET, 1, S, "di"),
      new UniqV(id(), "dar",     PRET, 2, S, "diste"),
      new UniqV(id(), "dar",     PRET, 3, S, "dio"),
      new UniqV(id(), "dar",     PRET, 1, P, "dimos"),
      new UniqV(id(), "dar",     PRET, 3, P, "dieron"),
      new UniqV(id(), "saber",   PRES, 1, S, "sé"),
      new UniqV(id(), "poner",   PRES, 1, S, "pongo"),
      new UniqV(id(), "venir",   PRES, 1, S, "vengo"),
      new UniqV(id(), "salir",   PRES, 1, S, "salgo"),
      new UniqV(id(), "parecer", PRES, 1, S, "parezco"),
      new UniqV(id(), "conocer", PRES, 1, S, "conozco"),
      new UniqV(id(), "empezar", PRET, 1, S, "empecé"),
      new UniqV(id(), "enviar",  PRES, 1, S, "envío"),
      new UniqV(id(), "enviar",  PRES, 2, S, "envías"),
      new UniqV(id(), "enviar",  PRES, 3, S, "envía"),
      new UniqV(id(), "enviar",  PRES, 1, P, "envían")
    ]

    this.byInfTensePersonNumber = {}
    for (const v of this.list) {
      const key =`${v.infEs}-${v.tense}${v.person}${v.number}`
      if (this.byInfTensePersonNumber[key]) throw new Error(`Collision with ${key}`)
      this.byInfTensePersonNumber[key] = v
    }
  }

  find(infEs:string, tense:Tense, person:Person, number:Number): UniqV | null {
    const key =`${infEs}-${tense}${person}${number}`
    return this.byInfTensePersonNumber[key]
  }
}
