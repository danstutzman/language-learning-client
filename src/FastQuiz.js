import type { Action } from './bank/ACtion'
import type { Exposure } from './Exposure'
import React from 'react'

type Props = {
  newCardAction:  Action,
  addExposure:    (Exposure) => void,
  playEs:         (string) => void,
  nextCard:       () => void
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
          this.props.nextCard()
          return {}
        }
      })
    }, 1000)
  }

  _getEs(props: Props) {
    if (props.newCardAction.card === undefined) {
      return '?'
    } else {
      return props.newCardAction.card.es
    }
  }

  componentWillMount() {
    this.props.playEs(this._getEs(this.props))
    this._restartCounter()
  }

  componentWillUpdate(nextProps: Props) {
    if (nextProps.newCardAction.actionId !==
        this.props.newCardAction.actionId) {
      this.props.playEs(this._getEs(nextProps))
      this._restartCounter()
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.eachSecondInterval)
  }

  _onClickIRemember() {
    this.props.addExposure({
      cardId:     this.props.newCardAction.actionId,
      remembered: true
    })
    window.clearInterval(this.eachSecondInterval)
    this.setState({ secondsLeft: 0 })
    this.props.nextCard()
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
