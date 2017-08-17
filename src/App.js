import type { Card } from './Card'
import type { Exposure } from './Exposure'
import type { AppState } from './AppState'
import React from 'react'
import NounBrowser from './NounBrowser' // eslint-disable-line no-unused-vars
import FastQuiz from './FastQuiz' // eslint-disable-line no-unused-vars
import SlowQuiz from './SlowQuiz' // eslint-disable-line no-unused-vars

type Props = {
  appState:       AppState,
  saveCardEdit:   (Card) => void,
  addExposure:    (Exposure) => void,
  sync:           () => void,
  playEs:         (string) => void,
  playSound:      () => void
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
        <NounBrowser cardByCardId={this.props.appState.cardByCardId}
          saveCardEdit={this.props.saveCardEdit}
          sync={this.props.sync}/>
      </div>
      <div style={{ display:
          (this.state.currentTab === 'FAST_QUIZ' ? 'block' : 'none') }}>
        { this.props.appState.fastHeap.empty() ||
          this.props.appState.cardByCardId[
            this.props.appState.fastHeap.peek()].remembered === false ?
          'No cards' :
          this.state.startedFastQuiz ?
            <FastQuiz topCard={this.props.appState.cardByCardId[
              this.props.appState.fastHeap.peek()]}
              addExposure={this.props.addExposure}
              playEs={this.props.playEs} /> :
            <button onClick={this.onClickStartFastQuiz.bind(this)}>
              Start Fast Quiz
            </button> }
      </div>
      <div style={{ display:
          (this.state.currentTab === 'SLOW_QUIZ' ? 'block' : 'none') }}>
        { this.props.appState.slowHeap.empty() ||
          this.props.appState.cardByCardId[
            this.props.appState.slowHeap.peek()].remembered === false ?
          'No cards' :
          this.state.startedSlowQuiz ?
            <SlowQuiz topCard={this.props.appState.cardByCardId[
              this.props.appState.slowHeap.peek()]}
              addExposure={this.props.addExposure} /> :
            <button onClick={this.onClickStartSlowQuiz.bind(this)}>
              Start Slow Quiz
            </button> }
      </div>
      <button onClick={this.props.playSound}>Play Sound</button>
    </div>
  }
}
