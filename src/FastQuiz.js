import type { Exposure } from './Exposure'
import type { Card } from './Card'
import React from 'react'
import { assertNonBlankStr } from './assertType'

type Props = {
  topCard:     Card,
  addExposure: (Exposure) => void,
  playEs:      (string) => void
}

type State = {
  secondsLeft: number
}

export default class FastQuiz extends React.Component<void, Props, State> {
  state: State
  eachSecondInterval: number

  _restartCounter() {
    this.setState({ secondsLeft: 3 })
    this.eachSecondInterval = window.setInterval(() => {
      this.setState(prevState => {
        if (prevState.secondsLeft > 0) {
          return { secondsLeft: prevState.secondsLeft - 1 }
        } else {
          window.clearInterval(this.eachSecondInterval)
          this.props.addExposure({
            cardId:     this.props.topCard.cardId,
            remembered: false
          })
          return {}
        }
      })
    }, 1000)
  }

  _getEs(props: Props): string {
    return assertNonBlankStr(props.topCard.es)
  }

  componentWillMount() {
    this.props.playEs(this._getEs(this.props))
    this._restartCounter()
  }

  componentWillUpdate(nextProps: Props) {
    if (nextProps.topCard.cardId !== this.props.topCard.cardId) {
      this.props.playEs(this._getEs(nextProps))
      this._restartCounter()
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
