import Exp from '../Exp'

export default class Prep extends Exp {
  en: string
  es: string

  constructor(expId:number, en:string, es:string) {
    super('Prep', expId)
    this.en   = en
    this.es   = es
  }

  toEs(): string {
    return this.es
  }

  toMorphemes(): Array<string> {
    return this.es.split(' ')
  }

  subExps(): Array<Exp> {
    return [this]
  }
}

export function assertPrep(exp: Exp | null): Prep {
  if (exp === null) throw new Error("Expected Prep but got null")
  if (exp.type === 'Prep') return ((exp:any):Prep)
  else throw new Error(`Expected Prep but got ${JSON.stringify(exp)}`)
}