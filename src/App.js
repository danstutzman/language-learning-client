import type { Action } from './action'
import LocalBank from './LocalBank'
import React from 'react'

type Props = {
  bank: LocalBank,
  addCard: () => void
}
 
class App extends React.Component<void, Props, void> {
  render() {
    const { bank, addCard } = this.props
    return (<ul>
      <li>unsyncedActions = {JSON.stringify(bank.unsyncedActions)}</li>
      <li>
        <button onClick={addCard}>Add Card</button>
      </li>
    </ul>)
  }
}

module.exports = App
