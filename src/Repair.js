import type { Card } from './Card'
import React from 'react'

type Props = {
  topCard:      Card,
  saveCardEdit: (Card) => void
}

type State = {
}

export default class Repair extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = {}
  }

  render() {
    return <div>
      <span className='en'>{this.props.topCard.en}</span>
      to
      <span className='es'>{this.props.topCard.es}</span>
      <br/>
      Mnemonic: <input type='text'/>
      <br/>
      <button className='big'>Save</button>
    </div>
  }
}
