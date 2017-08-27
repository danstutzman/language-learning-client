import Exp from '../Exp'
import type {ProType} from './ProType'

export default class Pro extends Exp {
  en:      string
  es:      string
  proType: ProType

  constructor(expId:number, en:string, es:string, proType:ProType) {
    super('Pro', expId)
    this.en      = en
    this.es      = es.normalize('NFC')
    this.proType = proType
  }

  toEs(): string {
    return this.es
  }

  toMorphemes(): Array<string> {
    return [this.es]
  }

  subExps(): Array<Exp> {
    return [this]
  }
}

export function assertPro(exp: Exp | null): Pro {
  if (exp === null) throw new Error("Expected Pro but got null")
  if (exp.type === 'Pro') return ((exp:any):Pro)
  else throw new Error(`Expected Pro but got ${JSON.stringify(exp)}`)
}