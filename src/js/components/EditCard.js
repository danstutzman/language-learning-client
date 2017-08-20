import type { Card } from '../Card'
import type { CardAdd } from '../CardAdd'
import type { CardUpdate } from '../CardUpdate'
import React from 'react'
import { STAGE0_MISSING_FIELDS, STAGE1_COMPLETE_FIELDS } from '../Card'
import { assertCardAdd } from '../CardAdd'
import {assertCardNumber, CARD_NUMBER_TO_STRING} from '../CardNumber'
import {assertCardGender} from "../CardGender"
import {assertCardType, CARD_TYPE_TO_STRING} from "../CardType"

type Props = {
  initialState:   Card,
  saveCardAdd:    (add: CardAdd) => void,
  saveCardUpdate: (cardId: number, update: CardUpdate) => void,
  close:          () => void
}

type State = Card

export default class EditCard extends React.Component<void, Props, State> {
  state: State

  constructor(props: Props) {
    super()
    this.state = (Object.assign({}, props.initialState): any)
  }

  componentWillReceiveProps(nextProps: Props) {
    this.state = (Object.assign({}, nextProps.initialState): any)
  }

  onClickSaveAdd() {
    const { type, gender, es, en, mnemonic, number } = this.state
    const add: CardAdd = { type, gender, es, en, mnemonic }
    if (type === '' || type === 'EsD') {
      add.number = number
    }

    this.props.saveCardAdd(assertCardAdd(add))

    this.props.close()
  }

  onClickSaveUpdate() {
    const cardUpdate: CardUpdate = (({}: any): CardUpdate) // workaround
    const fields = ['type', 'gender', 'es', 'en', 'mnemonic', 'suspended'
      ].concat(this.state.type === 'EsD' ? ['number'] : [])
    for (const field of fields) {
      const newValue = (this.state[field]: any)
      if (newValue !== undefined &&
          newValue !== this.props.initialState[field]) {
        cardUpdate[field] = newValue
      }
    }

    const { gender, es, en } = this.state
    if (this.props.initialState.stageNum === STAGE0_MISSING_FIELDS &&
        !(gender === '' || es === '' || en === '')) {
      cardUpdate.stageNum = STAGE1_COMPLETE_FIELDS
    } else if (this.props.initialState.stageNum >= STAGE1_COMPLETE_FIELDS &&
        (gender === '' || es === '' || en === '')) {
      cardUpdate.stageNum = STAGE0_MISSING_FIELDS
    }

    this.props.saveCardUpdate(this.props.initialState.cardId, cardUpdate)

    this.props.close()
  }

  isAddCardEnabled() {
    const { es, en } = this.state
    return es !== '' || en !== ''
  }

  isNew() {
    return this.props.initialState.cardId === -1
  }

  _renderSaveButton() {
    if (this.isNew()) {
      return <button onClick={this.onClickSaveAdd.bind(this)}>Add</button>
    } else {
      return <button onClick={this.onClickSaveUpdate.bind(this)}>Update</button>
    }
  }

  render() {
    const { type, gender, es, en, mnemonic, suspended, number } = this.state

    return <div>
      <button className='close' onClick={this.props.close}>X</button>

      <label>Type</label>
      <select value={type} onChange={e => {
        this.setState({ type: assertCardType(e.target.value) })
      }}>
        {Object.keys(CARD_TYPE_TO_STRING).map(cardType => {
          return <option>{cardType}</option>
        })}
      </select>
      <br/>

      <label>Gender</label>
      <select value={gender} onChange={e =>
          this.setState({gender: assertCardGender(e.target.value)})
        }>
        <option></option>
        <option>M</option>
        <option>F</option>
      </select>
      <br/>

      <label>Es</label>
      <input value={es} onChange={e => this.setState({es: e.target.value})}/>
      <br/>

      <label>En</label>
      <input value={en} onChange={e => this.setState({en: e.target.value})}/>
      <br/>

      <label>Mnemonic</label>
      <input value={mnemonic}
        onChange={e => this.setState({mnemonic: e.target.value})}/>
      <br/>

      {!this.isNew() && <div>
        <label>Suspended</label>
        <input type='checkbox' checked={suspended}
          onChange={e => this.setState({suspended: e.target.checked})}/>
        <br/>
      </div>}

      {(type === '' || type === 'EsD') && <div>
        <label>Number</label>
        <select value={number} onChange={e => {
          this.setState({number: assertCardNumber(e.target.value)}) }}>
          {Object.keys(CARD_NUMBER_TO_STRING).map(number => {
            return <option>{number}</option>
          })}
        </select>
      </div>}

      {this._renderSaveButton()}
    </div>
  }
}
