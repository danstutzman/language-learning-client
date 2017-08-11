// @flow
const assert      = require('assert')
const LocalBank   = require('./LocalBank')
const FakeBankApi = require('./FakeBankApi')

const api = new FakeBankApi()
const client = new LocalBank(api)
assert.equal(client.clientId, null)

client.sync()
assert.equal(client.clientId, 1)
