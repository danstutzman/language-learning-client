import type { Card } from './Card'
import React from 'react'
import AddNoun from './AddNoun' // eslint-disable-line no-unused-vars

type Props = {
  cards:   {[actionId: number]: Card},
  addCard: (Card) => void,
  sync:    () => void
}

type State = {
  showAddNoun: boolean
}

export default class NounBrowser extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = { showAddNoun: false }
  }

  _onAddCard(card: Card) {
    this.props.addCard(card)
    this.setState({ showAddNoun: false })
  }

  render() {
    const { cards, sync } = this.props
    return <div>
      {this.state.showAddNoun ?
        <AddNoun addCard={this._onAddCard.bind(this)} /> :
        null}
      <table>
        <thead>
          <tr>
            <th>actionId</th>
            <th>type</th>
            <th>gender</th>
            <th>es</th>
            <th>en</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(cards).map(actionId => {
            const card = cards[parseInt(actionId)]
            return <tr key={actionId}>
              <td>{actionId}</td>
              <td>{card.type}</td>
              <td>{card.gender}</td>
              <td>{card.es}</td>
              <td>{card.en}</td>
            </tr>
          })}
        </tbody>
      </table>
      <button onClick={()=>{ this.setState({ showAddNoun: true}) }}>
        Add Noun
      </button>
      <button onClick={sync}>Sync</button>
    </div>
  }
}
