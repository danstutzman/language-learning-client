import type { Card } from './Card'
import type { CardUpdate } from './CardUpdate'
import React from 'react'
import EditNoun from './EditNoun' // eslint-disable-line no-unused-vars
import { assertCard, newCard } from './Card'

type Props = {
  cardByCardId:   {[cardId: number]: Card},
  saveCardUpdate: (cardId: number, CardUpdate) => void,
  sync:           () => void
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

  _onSaveCardUpdate(cardId: number, cardUpdate: CardUpdate) {
    this.props.saveCardUpdate(cardId, cardUpdate)
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

  _renderCardEditMaybe() {
    const { editingCardId } = this.state
    if (editingCardId !== NOT_EDITING) {
      const initialState: Card = (editingCardId === ADD_NEW) ?
        newCard() : assertCard(this.props.cardByCardId[editingCardId])
      return <EditNoun
        cardId={editingCardId}
        initialState={initialState}
        saveCardUpdate={this._onSaveCardUpdate.bind(this)}
        close={this._onCloseCardEdit.bind(this)} />
    }
  }

  _renderTableHeader() {
    return <thead>
      <tr>
        <th>
          <a href='#' onClick={e=>{this._sortBy(e, 'ES')}}>Spanish</a>
        </th>
        <th>
          <a href='#' onClick={e=>{this._sortBy(e, 'EN')}}>English</a>
        </th>
      </tr>
    </thead>
  }

  render() {
    return <div>
      {this._renderCardEditMaybe()}
      <table className='noun-browser'>
        {this._renderTableHeader()}
        <tbody>
          {this._cardsSorted().map(card => {
            return <tr key={card.cardId}>
              <td className='es'>{card.es}</td>
              <td className='en'>{card.en}</td>
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
      <button className='big' onClick={this.props.sync}>Sync</button>
    </div>
  }
}
