import type { Card } from './Card'
import React from 'react'
import { assertCardGender } from './Card'

type Props = {
  cardId:       number,
  initialState: Card,
  saveCardEdit: (Card) => void
}

type State = Card

export default class EditNoun extends React.Component<void, Props, State> {
  state: State

  constructor(props: Props) {
    super()
    this.state = Object.assign({}, props.initialState)
  }

  onClickSave() {
    this.props.saveCardEdit(this.state)
  }

  isAddCardEnabled() {
    const { es, en } = this.state
    return es !== '' || en !== ''
  }

  render() {
    const { gender, es, en, mnemonic } = this.state

    return <div>
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

      <button onClick={this.onClickSave.bind(this)}>
        {this.state.cardId === -1 ? 'Add' : 'Edit'} Noun
      </button>
    </div>
  }
}
