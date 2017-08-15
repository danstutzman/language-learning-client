import React from 'react'
import type { Card } from './Card'
import NounBrowser from './NounBrowser' // eslint-disable-line no-unused-vars
import FastQuiz from './FastQuiz' // eslint-disable-line no-unused-vars

type Props = {
  cards:   {[actionId: number]: Card},
  addCard: (Card) => void,
  sync:    () => void
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
    const actionIds = Object.keys(this.props.cards)
		const actionId = parseInt(
			actionIds[Math.floor(Math.random() * actionIds.length)])
    const card = actionIds.length > 0 ? this.props.cards[actionId] : null

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
        { this.state.startedFastQuiz ?
          <FastQuiz cards={this.props.cards} card={card} /> :
          <button onClick={this.onClickStartFastQuiz.bind(this)}>
            Start Fast Quiz
          </button> }
      </div>
    </div>
  }
}
