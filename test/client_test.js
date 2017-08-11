// @flow
const assert      = require('assert')
const LocalBank   = require('./LocalBank')
const FakeBankApi = require('./FakeBankApi')
const { setup, suite, test } = require('mocha')

suite('LocalBank sync to FakeBankApi', ()=>{
  let api: FakeBankApi
  let client1: LocalBank
  let client2: LocalBank

  setup(() => {
    api = new FakeBankApi()
    client1 = new LocalBank(api)
    client2 = new LocalBank(api)
  })
  test('clientId starts out null', ()=>{
    assert.equal(client1.clientId, null)
  })
  test('clientId gets assigned from FakeBankApi', ()=>{
    client1.sync()
    assert.equal(client1.clientId, 1)
  })
  test('can add action before sync', ()=>{
    client1.addAction()
    assert.equal(client1.syncedActions.length, 0)
    assert.equal(client1.unsyncedActions.length, 1)
    assert.equal(client1.unsyncedActions[0].clientId, null)
    assert.equal(client1.unsyncedActions[0].actionId, 1)

    client1.sync()
    assert.equal(client1.syncedActions.length, 1)
    assert.equal(client1.unsyncedActions.length, 0)
    assert.equal(client1.syncedActions[0].clientId, 1)
    assert.equal(client1.syncedActions[0].actionId, 1)
  })
  test('client2 sees client1.1 action', ()=>{
    client1.addAction()
    client1.sync()
    client2.sync()
    assert.equal(client2.syncedActions.length, 1)
    assert.equal(client2.syncedActions[0].clientId, 1)
    assert.equal(client2.syncedActions[0].actionId, 1)
  })
  test("client1 and client2 see each others' actions", ()=>{
    client1.addAction()
    client2.addAction()

    client1.sync()
    assert.equal(client1.unsyncedActions.length, 0)
    assert.equal(client1.syncedActions.length, 1)
    assert.deepEqual(client1.syncedActions[0], { clientId: 1, actionId: 1 })

    client2.sync()
    assert.equal(client2.unsyncedActions.length, 0)
    assert.equal(client2.syncedActions.length, 2)
    assert.deepEqual(client2.syncedActions[0], { clientId: 1, actionId: 1 })
    assert.deepEqual(client2.syncedActions[1], { clientId: 2, actionId: 1 })

    client1.sync()
    assert.equal(client1.unsyncedActions.length, 0)
    assert.equal(client1.syncedActions.length, 2)
    assert.deepEqual(client1.syncedActions[0], { clientId: 1, actionId: 1 })
    assert.deepEqual(client1.syncedActions[1], { clientId: 2, actionId: 1 })
  })
})
