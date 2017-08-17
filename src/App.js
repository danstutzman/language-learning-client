import type { Card } from './Card'
import type { Exposure } from './Exposure'
import type { AddCardAction } from './bank/Action'
import React from 'react'
import NounBrowser from './NounBrowser' // eslint-disable-line no-unused-vars
import FastQuiz from './FastQuiz' // eslint-disable-line no-unused-vars
import SlowQuiz from './SlowQuiz' // eslint-disable-line no-unused-vars

type Props = {
  newCardAction:  AddCardAction | void,
  cards:          {[actionId: number]: Card},
  addCard:        (Card) => void,
  addExposure:    (Exposure) => void,
  sync:           () => void,
  playEs:         (string) => void,
  playSound:      () => void,
  nextCard:       () => void
}

type State = {
  currentTab:      'NOUN_BROWSER' | 'FAST_QUIZ' | 'SLOW_QUIZ',
  startedFastQuiz: boolean,
  startedSlowQuiz: boolean
}

export default class App extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = {
      currentTab: 'NOUN_BROWSER',
      startedFastQuiz: false,
      startedSlowQuiz: false
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

  onClickSlowQuizTab() {
    this.setState({
      currentTab: 'SLOW_QUIZ',
      startedSlowQuiz: false
    })
  }

  onClickStartFastQuiz() {
    this.setState({
      startedFastQuiz: true
    })
  }

  onClickStartSlowQuiz() {
    this.setState({
      startedSlowQuiz: true
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
      <button onClick={this.onClickSlowQuizTab.bind(this)}>
        Slow Quiz
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
            <FastQuiz newCardAction={this.props.newCardAction}
              addExposure={this.props.addExposure}
              playEs={this.props.playEs} nextCard={this.props.nextCard} /> :
            <button onClick={this.onClickStartFastQuiz.bind(this)}>
              Start Fast Quiz
            </button> }
      </div>
      <div style={{ display:
          (this.state.currentTab === 'SLOW_QUIZ' ? 'block' : 'none') }}>
        { this.props.newCardAction === undefined ? 'No cards' :
          this.state.startedSlowQuiz ?
            <SlowQuiz newCardAction={this.props.newCardAction}
              addExposure={this.props.addExposure}
              nextCard={this.props.nextCard} /> :
            <button onClick={this.onClickStartSlowQuiz.bind(this)}>
              Start Slow Quiz
            </button> }
      </div>
      <button onClick={this.props.playSound}>Play Sound</button>
    </div>
  }
}
