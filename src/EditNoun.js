import type { Card } from './Card'
import type { CardAdd } from './CardAdd'
import type { CardUpdate } from './CardUpdate'
import React from 'react'
import { assertCardGender, STAGE0_MISSING_FIELDS, STAGE1_COMPLETE_FIELDS
  } from './Card'
import { assertCardAdd } from './CardAdd'

type Props = {
  initialState:   Card,
  saveCardAdd:    (add: CardAdd) => void,
  saveCardUpdate: (cardId: number, update: CardUpdate) => void,
  close:          () => void
}

type State = Card

export default class EditNoun extends React.Component<void, Props, State> {
  state: State

  constructor(props: Props) {
    super()
    this.state = (Object.assign({}, props.initialState): any)
  }

  componentWillReceiveProps(nextProps: Props) {
    this.state = (Object.assign({}, nextProps.initialState): any)
  }

  onClickSaveAdd() {
    const { gender, es, en, mnemonic } = this.state
    const stageNum = (gender === '' || es === '' || en === '') ?
      STAGE0_MISSING_FIELDS : STAGE1_COMPLETE_FIELDS
    const add = { type: 'EsN', gender, es, en, stageNum, mnemonic }

    this.props.saveCardAdd(assertCardAdd(add))

    this.props.close()
  }

  onClickSaveUpdate() {
    const cardUpdate: CardUpdate = (({}: any): CardUpdate) // workaround
    for (const field of ['gender', 'es', 'en', 'mnemonic', 'suspended']) {
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
    const { gender, es, en, mnemonic, suspended } = this.state

    return <div>
      <button className='close' onClick={this.props.close}>X</button>

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

      {this._renderSaveButton()}
    </div>
  }
}
