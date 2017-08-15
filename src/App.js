import React from 'react'
import type { Card } from './Card'
import NounBrowser from './NounBrowser' // eslint-disable-line no-unused-vars

type Props = {
  cards:   {[actionId: number]: Card},
  addCard: (Card) => void,
  sync:    () => void
}

type State = {
  currentTab: 'NOUN_BROWSER' | 'FAST_QUIZ'
}

export default class App extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = {
      currentTab: 'NOUN_BROWSER'
    }
  }

  onClickNounBrowserTab() {
    this.setState({ currentTab: 'NOUN_BROWSER' })
  }

  onClickFastQuizTab() {
    this.setState({ currentTab: 'FAST_QUIZ' })
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
    </div>
  }
}
