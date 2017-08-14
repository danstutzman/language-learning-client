import assert                       from 'assert'
import LocalBank                    from '../src/LocalBank'
import FakeBankApi                  from './FakeBankApi'
import FakeLocalStorage             from './FakeLocalStorage'
import { SYNCED_KEY, UNSYNCED_KEY } from '../src/LocalStorage'
import { setup, suite, test}        from 'mocha'

suite('LocalBank persistence to LocalStorage', ()=>{
  test('can persist', ()=>{
    const api = new FakeBankApi()
    const storage = new FakeLocalStorage(1)
    const client = new LocalBank(api, storage)

    client.initFromLocalStorage()
    client.addAction()
    assert.deepEqual(JSON.parse(storage.getItem(SYNCED_KEY) || '{}'), {
      clientId: 1,
      clientIdToMaxSyncedActionId: {},
      syncedActions: []
    })
    assert.deepEqual(JSON.parse(storage.getItem(UNSYNCED_KEY) || '{}'), {
      nextActionId: 21,
      unsyncedActions: [{ actionId: 11, type: 'ADD_CARD' }]
    })

    const clientLater = new LocalBank(api, storage)
    clientLater.initFromLocalStorage()
    assert.equal(clientLater.clientId, 1)
    assert.equal(Object.keys(clientLater.clientIdToMaxSyncedActionId).length, 0)
    assert.equal(clientLater.syncedActions.length, 0)
    assert.equal(clientLater.nextActionId, 21)
    assert.deepEqual(clientLater.unsyncedActions,
      [{ actionId: 11, type: 'ADD_CARD' }])
  })
})

suite('LocalBank sync to FakeBankApi', ()=>{
  let api: FakeBankApi
  let client0: LocalBank
  let client1: LocalBank

  setup(() => {
    api = new FakeBankApi()
    client0 = new LocalBank(api, new FakeLocalStorage(0))
    client0.initFromLocalStorage()
    client1 = new LocalBank(api, new FakeLocalStorage(1))
    client1.initFromLocalStorage()
  })

  test('can add action before sync', done=>{
    client0.addAction()
    assert.equal(client0.syncedActions.length, 0)
    assert.equal(client0.unsyncedActions.length, 1)
    assert.equal(client0.unsyncedActions[0].actionId, 10)

    client0.sync().then(() => {
      assert.equal(client0.syncedActions.length, 1)
      assert.equal(client0.unsyncedActions.length, 0)
      assert.equal(client0.syncedActions[0].actionId, 10)
      done()
    }).catch(e => { done(e) })
  })
  test("client1 sees client0's action", done=>{
    client0.addAction()
    client0.sync().then(() => {
      client1.sync().then(() => {
        assert.equal(client1.syncedActions.length, 1)
        assert.equal(client1.syncedActions[0].actionId, 10)
        done()
      }).catch(e => { done(e) })
    }).catch(e => { done(e) })
  })
  test("client0 and client1 see each others' actions", done=>{
    client0.addAction()
    client1.addAction()

    client0.sync().then(() => {
      assert.equal(client0.unsyncedActions.length, 0)
      assert.equal(client0.syncedActions.length, 1)
      assert.equal(client0.syncedActions[0].actionId, 10)

      client1.sync().then(() => {
        assert.equal(client1.unsyncedActions.length, 0)
        assert.equal(client1.syncedActions[0].actionId, 10)
        assert.equal(client1.syncedActions[1].actionId, 11)

        client0.sync().then(() => {
          assert.equal(client0.unsyncedActions.length, 0)
          assert.equal(client0.syncedActions.length, 2)
          assert.equal(client0.syncedActions[0].actionId, 10)
          assert.equal(client0.syncedActions[1].actionId, 11)
          done()
        }).catch(e => { done(e) })
      }).catch(e => { done(e) })
    }).catch(e => { done(e) })
  })
})
