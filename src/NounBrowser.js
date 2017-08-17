import type { Card } from './Card'
import React from 'react'
import EditNoun from './EditNoun' // eslint-disable-line no-unused-vars

type Props = {
  cards:        {[actionId: number]: Card},
  saveCardEdit: (Card) => void,
  sync:         () => void
}

const NOT_EDITING = 0
const ADD_NEW = -1

type State = {
  editingCardId: number
}

export default class NounBrowser extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = { editingCardId: NOT_EDITING }
  }

  _onSaveCardEdit(card: Card) {
    this.props.saveCardEdit(card)
    this.setState({ editingCardId: NOT_EDITING })
  }

  render() {
    const { cards, sync } = this.props

    return <div>

      {this.state.editingCardId === NOT_EDITING ? null : <EditNoun
        cardId={this.state.editingCardId}
        initialState={this.state.editingCardId === ADD_NEW ?
          {cardId: ADD_NEW, type: 'EsN', gender: '', es: '', en: ''} :
          cards[this.state.editingCardId]}
        saveCardEdit={this._onSaveCardEdit.bind(this)} />}

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
              <td>
                <button onClick={()=>{
                  this.setState({ editingCardId: parseInt(actionId) })
                }}>Edit</button>
              </td>
            </tr>
          })}
        </tbody>
      </table>
      <button onClick={()=>{ this.setState({ editingCardId: ADD_NEW }) }}>
        Add Noun
      </button>
      <button onClick={sync}>Sync</button>
    </div>
  }
}
