import type { Exposure } from './Exposure'
import type { AppState } from './AppState'
import type { CardUpdate } from './CardUpdate'
import React from 'react'
import NounBrowser from './NounBrowser' // eslint-disable-line no-unused-vars
import FastQuiz from './FastQuiz' // eslint-disable-line no-unused-vars
import SlowQuiz from './SlowQuiz' // eslint-disable-line no-unused-vars
import cx from 'classnames'

type Props = {
  appState:       AppState,
  saveCardUpdate: (cardId: number, CardUpdate) => void,
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

  _setTab(newTab: 'NOUN_BROWSER' | 'FAST_QUIZ' | 'SLOW_QUIZ') {
    this.setState({
      currentTab: newTab,
      startedFastQuiz: false,
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
    const { currentTab } = this.state
    return <div className='tabs'>
      <button className={cx({ current: currentTab === 'NOUN_BROWSER' })}
          onClick={()=>{ this._setTab('NOUN_BROWSER') }}>
        List
      </button>
      <button className={cx({ current: currentTab === 'FAST_QUIZ' })}
          onClick={()=>{ this._setTab('FAST_QUIZ') }}>
        FastQ
      </button>
      <button className={cx({ current: currentTab === 'SLOW_QUIZ' })}
          onClick={()=>{ this._setTab('SLOW_QUIZ') }}>
        SlowQ
      </button>
    </div>
  }

  _renderNounBrowserMaybe() {
    if (this.state.currentTab === 'NOUN_BROWSER') {
      return <NounBrowser
        cardByCardId={this.props.appState.cardByCardId}
        saveCardUpdate={this.props.saveCardUpdate}
        sync={this.props.sync}/>
    }
  }

  _renderFastQuizMaybe() {
    const { appState, addExposure, playEs } = this.props
    if (this.state.currentTab === 'FAST_QUIZ') {
      if (appState.fastCards.empty()) {
        return <div>No cards</div>
      } else if (this.state.startedFastQuiz) {
        return <div>
          <FastQuiz
            topCard={appState.fastCards.getTopCard()}
            addExposure={addExposure}
            playEs={playEs} />
          ({appState.fastCards.getNumCards()} cards)
        </div>
      } else {
        return <div>
          <button className='big'
              onClick={this.onClickStartFastQuiz.bind(this)}>
            Start Fast Quiz
          </button>
          ({appState.fastCards.getNumCards()} cards)
        </div>
      }
    }
  }

  _renderSlowQuizMaybe() {
    const { appState, addExposure, playEs, saveCardUpdate } = this.props

    if (this.state.currentTab === 'SLOW_QUIZ') {
      if (appState.slowCards.empty()) {
        return <div>No cards</div>
      } else if (this.state.startedSlowQuiz) {
        return <SlowQuiz
          topCard={appState.slowCards.getTopCard()}
          numCardsLeft={appState.slowCards.getNumCards()}
          saveCardUpdate={saveCardUpdate}
          addExposure={addExposure}
          playEs={playEs} />
      } else {
        return <button className='big'
            onClick={this.onClickStartSlowQuiz.bind(this)}>
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
    </div>
  }
}
