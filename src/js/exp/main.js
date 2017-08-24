import VCloud from './verbs/VCloud'
import ExpIdSeq from './ExpIdSeq'

export function main() {
  const expIdSeq = new ExpIdSeq()
  const vcloud = new VCloud(expIdSeq)
  const corpus = `estoy está estás tiene tener tengo tienes quieres quiero
    pude`
  const verbs = corpus.trim().split(/\s+/).map(es => {
    return vcloud.findByEs(es)
  })

  let fragments: Array<string> = []
  for (const v of verbs) {
    fragments.push(v.toEs())
    fragments.push(' => ')
    for (const subExp of v.subExps()) {
      fragments.push(subExp.toEs())
      fragments.push(', ')
    }
    fragments.push('\n')
  }
  return fragments.join('')
}