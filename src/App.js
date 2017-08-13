import type { Action } from './action'
import LocalBank from './LocalBank'
import React from 'react'

type Props = {
  bank:    LocalBank,
  reinitBank: () => void,
  addCard:    () => void,
  sync:       () => void
}
 
class App extends React.Component<void, Props, void> {
  render() {
    const { bank, reinitBank, addCard, sync } = this.props
    return (<ul>
      <li>unsyncedActions = {JSON.stringify(bank.unsyncedActions)}</li>
      <li>
        <button onClick={reinitBank}>Re-init bank</button>
      </li>
      <li>
        <button onClick={addCard}>Add Card</button>
      </li>
      <li>
        <button onClick={sync}>Sync</button>
      </li>
    </ul>)
  }
}

module.exports = App
