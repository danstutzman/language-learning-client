// @flow
const assert      = require('assert')
const LocalBank   = require('./LocalBank')
const FakeBankApi = require('./FakeBankApi')
const { setup, suite, test } = require('mocha')

suite('LocalBank sync to FakeBankApi', ()=>{
  let api: FakeBankApi
  let client0: LocalBank
  let client1: LocalBank

  setup(() => {
    api = new FakeBankApi()
    client0 = new LocalBank(api, 0)
    client1 = new LocalBank(api, 1)
  })
  test('can add action before sync', ()=>{
    client0.addAction()
    assert.equal(client0.syncedActions.length, 0)
    assert.equal(client0.unsyncedActions.length, 1)
    assert.equal(client0.unsyncedActions[0].actionId, 10)

    client0.sync()
    assert.equal(client0.syncedActions.length, 1)
    assert.equal(client0.unsyncedActions.length, 0)
    assert.equal(client0.syncedActions[0].actionId, 10)
  })
  test("client1 sees client0's action", ()=>{
    client0.addAction()
    client0.sync()
    client1.sync()
    assert.equal(client1.syncedActions.length, 1)
    assert.equal(client1.syncedActions[0].actionId, 10)
  })
  test("client0 and client1 see each others' actions", ()=>{
    client0.addAction()
    client1.addAction()

    client0.sync()
    assert.equal(client0.unsyncedActions.length, 0)
    assert.equal(client0.syncedActions.length, 1)
    assert.deepEqual(client0.syncedActions[0], { actionId: 10 })

    client1.sync()
    assert.equal(client1.unsyncedActions.length, 0)
    assert.deepEqual(client1.syncedActions[0], { actionId: 10 })
    assert.deepEqual(client1.syncedActions[1], { actionId: 11 })

    client0.sync()
    assert.equal(client0.unsyncedActions.length, 0)
    assert.equal(client0.syncedActions.length, 2)
    assert.deepEqual(client0.syncedActions[0], { actionId: 10 })
    assert.deepEqual(client0.syncedActions[1], { actionId: 11 })
  })
})
