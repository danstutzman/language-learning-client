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

  onClickPlaySound() {
    // See http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api#32840804
    // If still no sound, check if hardware ringer switch is on vibrate-only
    if (window.myAudioContext === undefined) {
      if (window.AudioContext) {
        window.myAudioContext = new window.AudioContext()
      } else if (window.webkitAudioContext) {
        window.myAudioContext = new window.webkitAudioContext()
      } else {
        window.alert('Your browser does not support yet Web Audio API')
      }
    }

    const oscillator = window.myAudioContext.createOscillator()
    oscillator.frequency.value = 400
    oscillator.connect(window.myAudioContext.destination)
    oscillator.start(window.myAudioContext.currentTime)
    oscillator.stop(window.myAudioContext.currentTime + 1.0)
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
        { this.props.newCardAction === null ? 'No cards' :
          this.state.startedFastQuiz ?
            <FastQuiz newCardAction={assertAction(this.props.newCardAction)}
              addExposure={this.props.addExposure}
              speakUrlPrefix={this.props.speakUrlPrefix} /> :
            <button onClick={this.onClickStartFastQuiz.bind(this)}>
              Start Fast Quiz
            </button> }
      </div>
      <button onClick={this.onClickPlaySound.bind(this)}>Play Sound</button>
    </div>
  }
}
