import assert                       from 'assert'
import LocalBank                    from '../src/bank/LocalBank'
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
    client.addNoopAction()
    assert.deepEqual(JSON.parse(storage.getItem(SYNCED_KEY) || '{}'), {
      clientId: 1,
      clientIdToMaxSyncedActionId: {},
      actions: []
    })

    const unsynced = JSON.parse(storage.getItem(UNSYNCED_KEY) || '{}')
    assert.equal(unsynced.nextActionId, 21)
    assert.equal(unsynced.actions.length, 1)
    assert.equal(unsynced.actions[0].actionId, 11)
    assert.equal(unsynced.actions[0].type, 'NOOP')

    const clientLater = new LocalBank(api, storage)
    clientLater.initFromLocalStorage()
    assert.equal(clientLater.syncedState.clientId, 1)
    assert.equal(Object.keys(
          clientLater.syncedState.clientIdToMaxSyncedActionId).length, 0)
    assert.equal(clientLater.syncedState.actions.length, 0)
    assert.equal(clientLater.unsyncedState.nextActionId, 21)
    assert.equal(clientLater.unsyncedState.actions.length, 1)
    assert.equal(clientLater.unsyncedState.actions[0].actionId, 11)
    assert.equal(clientLater.unsyncedState.actions[0].type, 'NOOP')
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
    client0.addNoopAction()
    assert.equal(client0.syncedState.actions.length, 0)
    assert.equal(client0.unsyncedState.actions.length, 1)
    assert.equal(client0.unsyncedState.actions[0].actionId, 10)

    client0.sync().then(() => {
      assert.equal(client0.syncedState.actions.length, 1)
      assert.equal(client0.unsyncedState.actions.length, 0)
      assert.equal(client0.syncedState.actions[0].actionId, 10)
      done()
    }).catch(e => { done(e) })
  })
  test("client1 sees client0's action", done=>{
    client0.addNoopAction()
    client0.sync().then(() => {
      client1.sync().then(() => {
        assert.equal(client1.syncedState.actions.length, 1)
        assert.equal(client1.syncedState.actions[0].actionId, 10)
        done()
      }).catch(e => { done(e) })
    }).catch(e => { done(e) })
  })
  test("client0 and client1 see each others' actions", done=>{
    client0.addNoopAction()
    client1.addNoopAction()

    client0.sync().then(() => {
      assert.equal(client0.unsyncedState.actions.length, 0)
      assert.equal(client0.syncedState.actions.length, 1)
      assert.equal(client0.syncedState.actions[0].actionId, 10)

      client1.sync().then(() => {
        assert.equal(client1.unsyncedState.actions.length, 0)
        assert.equal(client1.syncedState.actions[0].actionId, 10)
        assert.equal(client1.syncedState.actions[1].actionId, 11)

        client0.sync().then(() => {
          assert.equal(client0.unsyncedState.actions.length, 0)
          assert.equal(client0.syncedState.actions.length, 2)
          assert.equal(client0.syncedState.actions[0].actionId, 10)
          assert.equal(client0.syncedState.actions[1].actionId, 11)
          done()
        }).catch(e => { done(e) })
      }).catch(e => { done(e) })
    }).catch(e => { done(e) })
  })
})
