import VCloud from './verbs/VCloud'
import ExpIdSeq from './ExpIdSeq'

export function main() {
  const expIdSeq = new ExpIdSeq()
  const vcloud = new VCloud(expIdSeq)
  const corpus = `estoy está estás tiene tener tengo tienes quieres quiero
    pude`
  const verbs = corpus.trim().split(/\s+/).map(es => {
    return vcloud.findByEs(es).toEs()
  })
  return JSON.stringify(verbs)
}