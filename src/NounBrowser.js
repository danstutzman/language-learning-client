import type { Card } from './Card'
import React from 'react'
import EditNoun from './EditNoun' // eslint-disable-line no-unused-vars

type Props = {
  cardByCardId: {[cardId: number]: Card},
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
    const { cardByCardId, sync } = this.props

    return <div>

      {this.state.editingCardId === NOT_EDITING ? null : <EditNoun
        cardId={this.state.editingCardId}
        initialState={this.state.editingCardId === ADD_NEW ?
          {cardId: ADD_NEW, type: 'EsN', gender: '', es: '', en: ''} :
          cardByCardId[this.state.editingCardId]}
        saveCardEdit={this._onSaveCardEdit.bind(this)} />}

      <table>
        <thead>
          <tr>
            <th>cardId</th>
            <th>type</th>
            <th>gender</th>
            <th>es</th>
            <th>en</th>
            <th>fast<br/>nods</th>
            <th>fast<br/>blink?</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(cardByCardId).map(cardId => {
            const card = cardByCardId[parseInt(cardId)]
            return <tr key={cardId}>
              <td>{cardId}</td>
              <td>{card.type}</td>
              <td>{card.gender}</td>
              <td>{card.es}</td>
              <td>{card.en}</td>
              <td>{card.numFastNods}</td>
              <td>{card.hadFastBlink ? 'true' : ''}</td>
              <td>
                <button onClick={()=>{
                  this.setState({ editingCardId: parseInt(cardId) })
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
