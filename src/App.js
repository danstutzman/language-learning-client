import type { Card } from './Card'
import type { Exposure } from './Exposure'
import type { AddCardAction } from './bank/Action'
import React from 'react'
import NounBrowser from './NounBrowser' // eslint-disable-line no-unused-vars
import FastQuiz from './FastQuiz' // eslint-disable-line no-unused-vars
import { assertAddCardAction } from './bank/Action'

type Props = {
  newCardAction:  AddCardAction | null,
  cards:          {[actionId: number]: Card},
  addCard:        (Card) => void,
  addExposure:    (Exposure) => void,
  sync:           () => void,
  playEs:         (string) => void,
  playSound:      () => void,
  nextCard:       () => void
}

type State = {
  currentTab:      'NOUN_BROWSER' | 'FAST_QUIZ',
  startedFastQuiz: boolean
}

export default class App extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = {
      currentTab: 'NOUN_BROWSER',
      startedFastQuiz: false
    }
  }

  onClickNounBrowserTab() {
    this.setState({
      currentTab: 'NOUN_BROWSER',
      startedFastQuiz: false
    })
  }

  onClickFastQuizTab() {
    this.setState({
      currentTab: 'FAST_QUIZ',
      startedFastQuiz: false
    })
  }

  onClickStartFastQuiz() {
    this.setState({
      startedFastQuiz: true
    })
  }

  render() {
    return <div>
      <button onClick={this.onClickNounBrowserTab.bind(this)}>
        Noun Browser
      </button>
      <button onClick={this.onClickFastQuizTab.bind(this)}>
        Fast Quiz
      </button>
      <hr/>
      <div style={{ display:
          (this.state.currentTab === 'NOUN_BROWSER' ? 'block' : 'none') }}>
        <NounBrowser cards={this.props.cards} addCard={this.props.addCard}
          sync={this.props.sync}/>
      </div>
      <div style={{ display:
          (this.state.currentTab === 'FAST_QUIZ' ? 'block' : 'none') }}>
        { this.props.newCardAction === undefined ? 'No cards' :
          this.state.startedFastQuiz ?
            <FastQuiz
              newCardAction={assertAddCardAction(this.props.newCardAction)}
              addExposure={this.props.addExposure}
              playEs={this.props.playEs} nextCard={this.props.nextCard} /> :
            <button onClick={this.onClickStartFastQuiz.bind(this)}>
              Start Fast Quiz
            </button> }
      </div>
      <button onClick={this.props.playSound}>Play Sound</button>
    </div>
  }
}
