import {PRES} from './verbs/Tense'
import {S} from './verbs/Number'
import VCloud from './verbs/VCloud'

export function main() {
  const v = new VCloud().conjugate("tener", PRES, 1, S)
  return v.toMorphemes()
}