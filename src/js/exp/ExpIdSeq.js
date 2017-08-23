// ExpIdSeq stands for ExpressionId Sequence
export default class ExpIdSeq {
  _nextId: number

  constructor() {
    this._nextId = 1
  }

  getNextId(): number {
    const toReturn = this._nextId
    this._nextId += 1
    return toReturn
  }
}