import React from 'react'

type Props = {
  cards:              {[actionId: number]: boolean},
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
