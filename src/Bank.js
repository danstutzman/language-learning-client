class Bank {
  data: { nextId: Number }

  constructor(data: { nextId: Number }) {
    this.data = data
  }

  nextId() {
    return this.data.nextId
  }
}

module.exports = Bank
