import type { Card } from './Card'
import React from 'react'

type Props = {
  topCard:      Card,
  saveCardEdit: (Card) => void
}

type State = {
  mnemonic: string
}

export default class Repair extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = {
      mnemonic: ''
    }
  }

  _onClickSave() {
    this.props.saveCardEdit(
        Object.assign({}, this.props.topCard, this.state))
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
      <div className='horizontal-margins'>
        <textarea value={this.state.mnemonic}
          onChange={e=>{ this.setState({ mnemonic: e.target.value }) }} />
      </div>

      <p>
        <span>Example for </span>
        <span className='en'>pen</span>
        <span> &rarr; </span>
        <span className='es'>pluma</span>
        <span>:</span>
      </p>
      <div className='horizontal-margins'>
        <blockquote>pen&apos;s end has feather plumage</blockquote>
      </div>

      <button className='big' onClick={()=>{this._onClickSave()}}>
        Save
      </button>
    </div>
  }
}
