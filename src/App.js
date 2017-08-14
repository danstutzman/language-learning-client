import React from 'react'
import type { Card } from './Card'

type Props = {
  cards:              {[actionId: number]: Card},
  addCard:            () => void,
  sync:               () => void
}

class App extends React.Component<void, Props, void> {
  render() {
    const { cards, addCard, sync } = this.props
    return (<ul>
      <li>cards = {JSON.stringify(cards)}</li>
      <li>
        <button onClick={addCard}>Add Card</button>
      </li>
      <li>
        <button onClick={sync}>Sync</button>
      </li>
    </ul>)
  }
}

export default App
