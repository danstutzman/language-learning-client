import type { Card } from './Card'
import type { Exposure } from './Exposure'
import type { Action } from './bank/Action'
import React from 'react'
import NounBrowser from './NounBrowser' // eslint-disable-line no-unused-vars
import FastQuiz from './FastQuiz' // eslint-disable-line no-unused-vars
import { assertAction } from './bank/Action'

type Props = {
  newCardAction:  Action | null,
  cards:          {[actionId: number]: Card},
  speakUrlPrefix: string,
  addCard:        (Card) => void,
  addExposure:    (Exposure) => void,
  sync:           () => void
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
        { this.newCardAction === null ? 'No cards' :
          this.state.startedFastQuiz ?
            <FastQuiz newCardAction={assertAction(this.props.newCardAction)}
              addExposure={this.props.addExposure}
              speakUrlPrefix={this.props.speakUrlPrefix} /> :
            <button onClick={this.onClickStartFastQuiz.bind(this)}>
              Start Fast Quiz
            </button> }
      </div>
    </div>
  }
}
