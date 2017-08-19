import type { Exposure } from './Exposure'
import type { Card } from './Card'
import React from 'react'

type Props = {
  topCard:      Card,
  addExposure:  (Exposure) => void
}

type State = {
  showMnemonic: boolean
}

export default class FastQuiz extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = { showMnemonic: false }
  }

  _onClickIRemember() {
    this.props.addExposure({
      type:   'SLOW_NOD',
      cardId: this.props.topCard.cardId
    })
    this.setState({ showMnemonic: false })
  }

  render() {
    const topCard = this.props.topCard
    return <div>

      <p className='en'>{topCard.en}</p>

      <button className='big'
          onClick={()=>{ this.setState({ showMnemonic: true }) }}>
        Show Mnemonic
      </button>

      {this.state.showMnemonic && <div>{topCard.mnemonic}</div>}

      <button className='big'
          onClick={this._onClickIRemember.bind(this)}>
        I Understand
      </button>

    </div>
  }
}
