import Exp from '../Exp'

export default class Pro extends Exp {
  en:     string
  es:     string

  constructor(expId:number, en:string, es:string) {
    super('Pro', expId)
    this.en   = en
    this.es      = es.normalize('NFC')
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