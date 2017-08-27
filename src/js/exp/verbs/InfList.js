import ExpIdSeq from '../ExpIdSeq'
import Inf from './Inf'

export default class InfList {
  list: Array<Inf>
  byEs: {[string]: Inf}

  constructor(expIdSeq: ExpIdSeq) {
    const id = () => { return expIdSeq.getNextId() }
    this.list = [
      new Inf(id(), 'want', 'querer'),
      new Inf(id(), 'need', 'necesitar'),
      new Inf(id(), 'have', 'tener'),
      new Inf(id(), 'give', 'dar'),
      new Inf(id(), 'tell', 'decir'),
      new Inf(id(), 'ask', 'preguntar'),
      new Inf(id(), 'command', 'ordenar'),
      new Inf(id(), 'eat', 'comer'), // need a regular -er
      new Inf(id(), 'be', 'ser'),
      new Inf(id(), 'be', 'estar'),
      new Inf(id(), 'do', 'hacer'),
      new Inf(id(), 'can', 'poder'),
      new Inf(id(), 'follow', 'seguir'),
      new Inf(id(), 'find', 'encontrar'),
      new Inf(id(), 'come', 'venir'),
      new Inf(id(), 'think', 'pensar'),
      new Inf(id(), 'return', 'volver'),
      new Inf(id(), 'feel', 'sentir'),
      new Inf(id(), 'tell', 'contar'),
      new Inf(id(), 'start', 'empezar'),
      new Inf(id(), 'remember', 'recordar'),
      new Inf(id(), 'request', 'pedir'),
      new Inf(id(), 'walk', 'andar'),
      new Inf(id(), 'know', 'saber'),
      new Inf(id(), 'put', 'poner'),
      new Inf(id(), 'go', 'ir'),
      new Inf(id(), 'see', 'ver'),
      new Inf(id(), 'leave', 'salir'),
      new Inf(id(), 'appear', 'parecer'),
      new Inf(id(), 'know', 'conocer'),
      new Inf(id(), 'send', 'enviar'),
      new Inf(id(), 'understand', 'comprender'),
      new Inf(id(), 'speak', 'hablar'),
      new Inf(id(), 'understand', 'entender'),
    ]

    this.byEs = {}
    for (const inf of this.list) {
      const key = inf.es
      if (this.byEs[key]) throw new Error(`Collision with ${key}`)
      this.byEs[key] = inf
    }
  }
}