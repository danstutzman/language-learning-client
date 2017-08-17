import type { Exposure } from './Exposure'
import type { Card } from './Card'
import React from 'react'
import { assertNonBlankStr } from './assertType'

type Props = {
  topCard:     Card,
  addExposure: (Exposure) => void,
  playEs:      (string) => Promise<void>
}

type State = {
  secondsLeft: 'WAITING' | number
}

export default class FastQuiz extends React.Component<void, Props, State> {
  state: State
  eachSecondInterval: number

  constructor() {
    super()
    this.state = {
      secondsLeft: 'WAITING'
    }
  }

  _restartCounter() {
    this.setState({ secondsLeft: 3 })
    this.eachSecondInterval = window.setInterval(() => {
      this.setState(prevState => {
        if (prevState.secondsLeft !== 'WAITING' && prevState.secondsLeft > 0) {
          return { secondsLeft: prevState.secondsLeft - 1 }
        } else {
          window.clearInterval(this.eachSecondInterval)
          this.props.addExposure({
            cardId:     this.props.topCard.cardId,
            remembered: false
          })
          return { secondsLeft: 0 }
        }
      })
    }, 1000)
  }

  _getEs(props: Props): string {
    return assertNonBlankStr(props.topCard.es)
  }

  componentWillMount() {
    this.props.playEs(this._getEs(this.props))
      .then(this._restartCounter.bind(this))
  }

  componentWillUpdate(nextProps: Props) {
    if (nextProps.topCard.cardId !== this.props.topCard.cardId) {
    this.setState({ secondsLeft: 'WAITING' })
      this.props.playEs(this._getEs(nextProps))
        .then(this._restartCounter.bind(this))
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.eachSecondInterval)
  }

  _onClickIRemember() {
    this.props.addExposure({
      cardId:     this.props.topCard.cardId,
      remembered: true
    })
    window.clearInterval(this.eachSecondInterval)
    this.setState({ secondsLeft: 0 })
  }

  render() {
    const es = this._getEs(this.props)
    return <div>
      <p>{es}</p>
      <button onClick={()=>{this.props.playEs(es)}}>Play</button>
      <div>Time: {this.state.secondsLeft}</div>
      <button onClick={this._onClickIRemember.bind(this)}>
        I Understand
      </button>
    </div>
  }
}
