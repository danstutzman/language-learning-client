// @flow
const assert      = require('assert')
const LocalBank   = require('./LocalBank')
const FakeBankApi = require('./FakeBankApi')
const { setup, suite, test } = require('mocha')

suite('LocalBank sync to FakeBankApi', ()=>{
  let api
  let client

  setup(() => {
    api = new FakeBankApi()
    client = new LocalBank(api)
  })
  suite('clientId', ()=>{
    test('starts out null', ()=>{
      assert.equal(client.clientId, null)
    })
    test('gets assigned from FakeBankApi', ()=>{
      client.sync()
      assert.equal(client.clientId, 1)
    })
  })
})
