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

type StateSortBy = 'CARD_ID' | 'ES' | '-ES' | 'EN' | '-EN'

type State = {
  editingCardId: number,
  sortBy: StateSortBy
}

function strcmp(s1: string, s2: string) {
  return (s1 < s2) ? -1 : (s1 > s2 ? 1 : 0)
}

const sortByToComparer = {
  CARD_ID: (c1, c2) => { return c1.cardId - c2.cardId },
  ES:      (c1, c2) => { return  strcmp(c1.es, c2.es) },
  '-ES':   (c1, c2) => { return -strcmp(c1.es, c2.es) },
  EN:      (c1, c2) => { return  strcmp(c1.en, c2.en) },
  '-EN':   (c1, c2) => { return -strcmp(c1.en, c2.en) }
}

export default class NounBrowser extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = {
      editingCardId: NOT_EDITING,
      sortBy:        'CARD_ID'
    }
  }

  _onSaveCardEdit(card: Card) {
    this.props.saveCardEdit(card)
  }

  _onCloseCardEdit() {
    this.setState({ editingCardId: NOT_EDITING })
  }

  _sortBy(e: Event, sortBy: StateSortBy) {
    e.preventDefault()
    this.setState(prevState => {
      return (prevState.sortBy === sortBy) ?
        { sortBy: '-' + sortBy } : { sortBy }
    })
  }

  _cardsSorted() {
    const { cardByCardId } = this.props
    const cards = Object.keys(cardByCardId).map(cardId => {
      return cardByCardId[parseInt(cardId)]
    })
    cards.sort(sortByToComparer[this.state.sortBy])
    return cards
  }

  render() {
    const { cardByCardId, sync } = this.props

    return <div>

      {this.state.editingCardId === NOT_EDITING ? null : <EditNoun
        cardId={this.state.editingCardId}
        initialState={this.state.editingCardId === ADD_NEW ?
          {cardId: ADD_NEW, type: 'EsN', gender: '', es: '', en: ''} :
          cardByCardId[this.state.editingCardId]}
        saveCardEdit={this._onSaveCardEdit.bind(this)}
        close={this._onCloseCardEdit.bind(this)} />}

      <table className='noun-browser'>
        <thead>
          <tr>
            <th>
              <a href='#' onClick={e=>{this._sortBy(e, 'ES')}}>Spanish</a>
            </th>
            <th>
              <a href='#' onClick={e=>{this._sortBy(e, 'EN')}}>English</a>
            </th>
            <th>fast<br/>nods</th>
            <th>fast<br/>blink?</th>
          </tr>
        </thead>
        <tbody>
          {this._cardsSorted().map(card => {
            return <tr key={card.cardId}>
              <td className='es'>{card.es}</td>
              <td className='en'>{card.en}</td>
              <td>{card.numFastNods}</td>
              <td>{card.hadFastBlink ? 'true' : ''}</td>
              <td>
                <button onClick={()=>{
                  this.setState({ editingCardId: parseInt(card.cardId) })
                }}>Edit</button>
              </td>
            </tr>
          })}
        </tbody>
      </table>
      <button className='big'
          onClick={()=>{ this.setState({ editingCardId: ADD_NEW }) }}>
        Add Noun
      </button>
      <button className='big' onClick={sync}>Sync</button>
    </div>
  }
}
