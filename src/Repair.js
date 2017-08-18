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
      <p>
        Write a mnemonic sentence for
        <br/>
        <span className='en'>{this.props.topCard.en}</span>
        <span> &rarr; </span>
        <span className='es'>{this.props.topCard.es}</span>
      </p>
      <textarea></textarea>

      <p>
        <span>Example for </span>
        <span className='en'>pen</span>
        <span> &rarr; </span>
        <span className='es'>pluma</span>
        <span>:</span>
      </p>
      <blockquote>pen&apos;s end has feather plumage</blockquote>
      <br/>
      <button className='big'>Save</button>
    </div>
  }
}
