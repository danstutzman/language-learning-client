import type { Action } from './bank/ACtion'
import type { Exposure } from './Exposure'
import React from 'react'

type Props = {
  newCardAction:  Action,
  addExposure:    (Exposure) => void,
  playEs:         (string) => void
}

type State = {
  secondsLeft: number
}

export default class FastQuiz extends React.Component<void, Props, State> {
  state: State
  eachSecondInterval: number

  constructor() {
    super()
    this.state = {
      secondsLeft: 3
    }
  }

  componentWillMount() {
    this.eachSecondInterval = window.setInterval(() => {
      this.setState(prevState => {
        if (prevState.secondsLeft > 0) {
          return { secondsLeft: prevState.secondsLeft - 1 }
        } else {
          window.clearInterval(this.eachSecondInterval)
          return {}
        }
      })
    }, 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.eachSecondInterval)
  }

  onClickIRemember() {
    this.props.addExposure({
      cardId:     this.props.newCardAction.actionId,
      remembered: true
    })
    this.setState({ secondsLeft: 0 })
  }

  render() {
    const es = (this.props.newCardAction.card || { es: '?' }).es
    return <div>
      {this.props.newCardAction === null ? 'No cards' :
        <div>
          <p>{es}</p>
          <button onClick={()=>{this.props.playEs(es)}}>Play</button>
          <div>Time: {this.state.secondsLeft}</div>
          <button onClick={this.onClickIRemember.bind(this)}>
            I Understand
          </button>
        </div>}
    </div>
  }
}
