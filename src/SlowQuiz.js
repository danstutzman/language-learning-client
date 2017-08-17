import type { AddCardAction } from './bank/ACtion'
import type { Exposure } from './Exposure'
import React from 'react'

type Props = {
  newCardAction:  AddCardAction,
  addExposure:    (Exposure) => void,
  nextCard:       () => void
}

export default class FastQuiz extends React.Component<void, Props, void> {
  _onClickIRemember() {
    this.props.addExposure({
      cardId:     this.props.newCardAction.actionId,
      remembered: true
    })
    this.props.nextCard()
  }

  render() {
    const en = this.props.newCardAction.card.en
    return <div>
      <p>{en}</p>
      <button onClick={this._onClickIRemember.bind(this)}>
        I Understand
      </button>
    </div>
  }
}
