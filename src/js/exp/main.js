import VCloud from './verbs/VCloud'
import ExpIdSeq from './ExpIdSeq'
import NPCloud from './nouns/NPCloud'
import VC from './clauses/VC'
import PrepP from './nouns/PrepP'
import {assertPrep} from './nouns/Prep'

export function main() {
  const expIdSeq = new ExpIdSeq()
  const vCloud = new VCloud(expIdSeq)
  // const corpus = `estoy está estás tiene tener tengo tienes quieres quiero
  //   pude`
  // const verbs = corpus.trim().split(/\s+/).map(es => {
  //   return vCloud.findByEs(es)
  // })

  const npCloud = new NPCloud(expIdSeq)
  // const corpus = ['un hombre', 'una mujer']
  // const nps = corpus.map(es => {
  //   return npCloud.findByEs(es)
  // })

  // const exps = [new VC({
  //   expId: expIdSeq.getNextId(),
  //   agent: npCloud.findByEs('yo'),
  //   doPro: ((npCloud.findByEs('lo'):any):Pro),
  //   v:     vCloud.findByEs('comprendo')
  // })]

  // const exps = [new NC({
  //   expId: expIdSeq.getNextId(),
  //   pro:   assertPro(npCloud.proList.find('dónde')),
  //   vc:    new VC({
  //     expId:     expIdSeq.getNextId(),
  //     agent:     npCloud.findByEs('Juan'),
  //     v:         vCloud.findByEs('está'),
  //     verbFirst: true
  //   })
  // })]

  const exps = [new VC({
    expId: expIdSeq.getNextId(),
    agent: npCloud.findByEs('Juan'),
    v:     vCloud.findByEs('es'),
    do:    new PrepP({
      expId: expIdSeq.getNextId(),
      prep:  assertPrep(npCloud.prepList.findByEs('de')),
      np:    npCloud.findByEs('México')
    })
  })]

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