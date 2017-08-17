import type { Exposure } from './Exposure'
import type { Card } from './Card'
import React from 'react'

type Props = {
  topCard:      Card,
  addExposure:  (Exposure) => void
}

export default class FastQuiz extends React.Component<void, Props, void> {
  _onClickIRemember() {
    this.props.addExposure({
      cardId:     this.props.topCard.cardId,
      remembered: true
    })
  }

  render() {
    const en = this.props.topCard.en
    return <div>
      <p>{en}</p>
      <button onClick={this._onClickIRemember.bind(this)}>
        I Understand
      </button>
    </div>
  }
}
