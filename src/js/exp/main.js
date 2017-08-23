import {PRES} from './verbs/Tense'
import {S} from './verbs/Number'
import VCloud from './verbs/VCloud'
import ExpIdSeq from './ExpIdSeq'

export function main() {
  const expIdSeq = new ExpIdSeq()
  const vcloud = new VCloud(expIdSeq)
  const v1 = vcloud.conjugate("tener", PRES, 1, S)
  const v2 = vcloud.conjugate("tener", PRES, 3, S)
  const v3 = vcloud.conjugate("comer", PRES, 1, S)
  return JSON.stringify([
    v1,
    v2,
    v3
  ])
}