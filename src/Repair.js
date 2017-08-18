import type { Card } from './Card'
import type { AppState } from './AppState'
import React from 'react'

type Props = {
  appState:       AppState,
  saveCardEdit:   (Card) => void
}

type State = {
}

export default class Repair extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = {}
  }

  render() {
    return <div>
    </div>
  }
}
