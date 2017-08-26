import VCloud from './verbs/VCloud'
import ExpIdSeq from './ExpIdSeq'
import NPCloud from './nouns/NPCloud'
import VC from './clauses/VC'
import Pro from './nouns/Pro'

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

  const exps = [new VC({
    expId: expIdSeq.getNextId(),
    agent: npCloud.findByEs('yo'),
    doPro: ((npCloud.findByEs('lo'):any):Pro),
    v:     vCloud.findByEs('comprendo')
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