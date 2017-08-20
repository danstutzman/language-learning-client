import type { Exposure } from './Exposure'
import type { AppState } from './AppState'
import type { CardUpdate } from './CardUpdate'
import React from 'react'
import NounBrowser from './NounBrowser' // eslint-disable-line no-unused-vars
import Listen from './Listen' // eslint-disable-line no-unused-vars
import Speak from './Speak' // eslint-disable-line no-unused-vars
import SpeakSummary from './SpeakSummary' // eslint-disable-line no-unused-vars
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
  currentTab:      'NOUN_BROWSER' | 'LISTEN' | 'SPEAK',
  startedListen: boolean,
  startedSpeak: boolean
}

export default class App extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = {
      currentTab: 'NOUN_BROWSER',
      startedListen: false,
      startedSpeak: false
    }
  }

  _setTab(newTab: 'NOUN_BROWSER' | 'LISTEN' | 'SPEAK') {
    this.setState({
      currentTab: newTab,
      startedListen: false,
      startedSpeak: false
    })
  }

  onClickStartListen() {
    this.setState({
      startedListen: true
    })
  }

  onClickStartSpeak() {
    this.setState({
      startedSpeak: true
    })
  }

  _renderTabs() {
    const { currentTab } = this.state
    return <div className='tabs'>
      <button className={cx({ current: currentTab === 'NOUN_BROWSER' })}
          onClick={()=>{ this._setTab('NOUN_BROWSER') }}>
        List
      </button>
      <button className={cx({ current: currentTab === 'LISTEN' })}
          onClick={()=>{ this._setTab('LISTEN') }}>
        Listen
      </button>
      <button className={cx({ current: currentTab === 'SPEAK' })}
          onClick={()=>{ this._setTab('SPEAK') }}>
        Speak
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

  _renderListenMaybe() {
    const { appState, addExposure, playEs } = this.props
    if (this.state.currentTab === 'LISTEN') {
      if (appState.listenCards.empty()) {
        return <div>No cards</div>
      } else if (this.state.startedListen) {
        return <div>
          <Listen
            topCard={appState.listenCards.getTopCard()}
            addExposure={addExposure}
            playEs={playEs} />
          ({appState.listenCards.getNumCards()} cards)
        </div>
      } else {
        return <div>
          <button className='big'
              onClick={this.onClickStartListen.bind(this)}>
            Start Listen 
          </button>
          ({appState.listenCards.getNumCards()} cards)
        </div>
      }
    }
  }

  _renderSpeakMaybe() {
    const { appState, addExposure, playEs, saveCardUpdate } = this.props

    if (this.state.currentTab === 'SPEAK') {
      if (this.state.startedSpeak && !appState.speakCards.empty()) {
        return <Speak
          topCard={appState.speakCards.getTopCard()}
          numCardsLeft={appState.speakCards.getNumCards()}
          saveCardUpdate={saveCardUpdate}
          addExposure={addExposure}
          playEs={playEs} />
      } else {
        return <SpeakSummary
          cardStagesSummary={appState.speakCards.getCardStagesSummary()}
          startSpeak={()=>{ this.setState({ startedSpeak: true }) }} />
      }
    }
  }

  render() {
    return <div>
      { this._renderTabs() }
      { this._renderNounBrowserMaybe() }
      { this._renderListenMaybe() }
      { this._renderSpeakMaybe() }
    </div>
  }
}
