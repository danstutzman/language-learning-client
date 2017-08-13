import type { Action } from './action'
import React from 'react'

type Props = {
  actions: Array<Action>,
  addCard: () => void
}
 
class App extends React.Component<void, Props, void> {
  render() {
    const { actions, addCard } = this.props
    return (<ul>
      <li>unsyncedActions = {JSON.stringify(actions)}</li>
      <li>
        <button onClick={addCard}>Add Card</button>
      </li>
    </ul>)
  }
}

module.exports = App
