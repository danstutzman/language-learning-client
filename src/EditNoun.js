import type { Card } from './Card'
import type { CardUpdate } from './CardUpdate'
import React from 'react'
import { assertCardGender, STAGE0_MISSING_FIELDS, STAGE1_COMPLETE_FIELDS
  } from './Card'

type Props = {
  initialState:   Card,
  saveCardUpdate: (cardId: number, CardUpdate) => void,
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

  onClickSave() {
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

  render() {
    const { gender, es, en, mnemonic, suspended } = this.state
    const isNew = this.props.initialState.cardId === -1

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

      {!isNew && <div>
        <label>Suspended</label>
        <input type='checkbox' checked={suspended}
          onChange={e => this.setState({suspended: e.target.checked})}/>
        <br/>
      </div>}

      <button onClick={this.onClickSave.bind(this)}>
        {isNew ? 'Add' : 'Edit'} Noun
      </button>
    </div>
  }
}
