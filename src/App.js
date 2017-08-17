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
  playEs:         (string) => Promise<void>,
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

  _renderTabs() {
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
    </div>
  }

  _renderNounBrowserMaybe() {
    if (this.state.currentTab === 'NOUN_BROWSER') {
      return <NounBrowser
        cardByCardId={this.props.appState.cardByCardId}
        saveCardEdit={this.props.saveCardEdit}
        sync={this.props.sync}/>
    }
  }

  _renderFastQuizMaybe() {
    const { appState, addExposure, playEs } = this.props
    if (this.state.currentTab === 'FAST_QUIZ') {
      if (appState.fastHeap.empty() || appState.cardByCardId[
            appState.fastHeap.peek()].remembered === false) {
        return <div>No cards</div>
      } else if (this.state.startedFastQuiz) {
        return <FastQuiz
          topCard={appState.cardByCardId[appState.fastHeap.peek()]}
          addExposure={addExposure}
          playEs={playEs} />
      } else {
        return <button onClick={this.onClickStartFastQuiz.bind(this)}>
          Start Fast Quiz
        </button>
      }
    }
  }

  _renderSlowQuizMaybe() {
    const { appState, addExposure } = this.props
    if (this.state.currentTab === 'SLOW_QUIZ') {
      if (appState.slowHeap.empty() || appState.cardByCardId[
          appState.slowHeap.peek()].remembered === false) {
        return <div>No cards</div>
      } else if (this.state.startedSlowQuiz) {
        return <SlowQuiz
          topCard={appState.cardByCardId[appState.slowHeap.peek()]}
          addExposure={addExposure} />
      } else {
        return <button onClick={this.onClickStartSlowQuiz.bind(this)}>
          Start Slow Quiz
        </button>
      }
    }
  }

  render() {
    return <div>
      { this._renderTabs() }
      { this._renderNounBrowserMaybe() }
      { this._renderFastQuizMaybe() }
      { this._renderSlowQuizMaybe() }
      <button onClick={this.props.playSound}>Play Sound</button>
    </div>
  }
}
