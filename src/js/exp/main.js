import VCloud from './verbs/VCloud'
import ExpIdSeq from './ExpIdSeq'
import NPCloud from './nouns/NPCloud'
import VC from './clauses/VC'
import PrepP from './nouns/PrepP'
import {assertPrep} from './nouns/Prep'
import Interjection from './clauses/Interjection'
import NC from './clauses/NC'
import {assertPro} from './nouns/Pro'
import Exp from './Exp'
import Pro from './nouns/Pro'
import type {V} from './verbs/V'
import NP from './nouns/NP'
import Adj from './nouns/Adj'
import {M} from './nouns/Gender'

function someNps(npCloud:NPCloud): Array<NP> { // eslint-disable-line no-unused-vars
  const corpus = ['un hombre', 'una mujer']
  return corpus.map(es => {
    return npCloud.findByEs(es)
  })
}

function someVs(vCloud:VCloud): Array<V> { // eslint-disable-line no-unused-vars
  const corpus = `estoy está estás tiene tener tengo tienes quieres quiero
    pude`
  return corpus.trim().split(/\s+/).map(es => {
    return vCloud.findByEs(es)
  })
}

function someVC(expIdSeq:ExpIdSeq, npCloud:NPCloud, vCloud:VCloud): VC { // eslint-disable-line no-unused-vars
  return new VC({
    expId: expIdSeq.getNextId(),
    agent: npCloud.findByEs('yo'),
    doPro: ((npCloud.findByEs('lo'):any):Pro),
    v:     vCloud.findByEs('comprendo')
  })
}

function someNC(expIdSeq:ExpIdSeq, npCloud:NPCloud, vCloud:VCloud): NC { // eslint-disable-line no-unused-vars
  return new NC({
    expId: expIdSeq.getNextId(),
    pro:   assertPro(npCloud.proList.find('dónde')),
    vc:    new VC({
      expId:     expIdSeq.getNextId(),
      agent:     npCloud.findByEs('Juan'),
      v:         vCloud.findByEs('está'),
      verbFirst: true
    })
  })
}

function someVCWithDe(expIdSeq:ExpIdSeq, npCloud:NPCloud, vCloud:VCloud): VC { // eslint-disable-line no-unused-vars
  return new VC({
    expId: expIdSeq.getNextId(),
    agent: npCloud.findByEs('Juan'),
    v:     vCloud.findByEs('es'),
    do:    new PrepP({
      expId: expIdSeq.getNextId(),
      prep:  assertPrep(npCloud.prepList.findByEs('de')),
      np:    npCloud.findByEs('México')
    })
  })
}

function someVCWithAdj(expIdSeq:ExpIdSeq, npCloud:NPCloud, vCloud:VCloud): VC { // eslint-disable-line no-unused-vars
  return new VC({
    expId: expIdSeq.getNextId(),
    agent: npCloud.findByEs('Juan'),
    v:     vCloud.findByEs('es'),
    do:    new Adj(expIdSeq.getNextId(),
             'norteamericano', 'North American', M)
  })
}

function someInterjection(expIdSeq:ExpIdSeq): Interjection { // eslint-disable-line no-unused-vars
  return new Interjection(expIdSeq.getNextId(),
    'Buenos días.',
    'Good morning.',
    ['bueno', '-s', 'día', '-s'])
}

export function main() {
  const expIdSeq = new ExpIdSeq()
  const vCloud = new VCloud(expIdSeq) // eslint-disable-line no-unused-vars
  const npCloud = new NPCloud(expIdSeq) // eslint-disable-line no-unused-vars
  let exps: Array<Exp> = []

  exps.push(someVCWithAdj(expIdSeq, npCloud, vCloud))

  let fragments: Array<string> = []
  for (const exp of exps) {
    fragments.push(exp.toEs())
    fragments.push(' => ')
    for (const subExp of exp.subExps()) {
      fragments.push(subExp.toEs())
      fragments.push(', ')
    }
    fragments.push('\n')
  }
  return fragments.join('')
}