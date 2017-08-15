import type { Action } from './bank/ACtion'
import type { Exposure } from './Exposure'
import React from 'react'

type Props = {
  newCardAction:  Action,
  addExposure:    (Exposure) => void,
  speakUrlPrefix: string
}

type State = {
  secondsLeft: number
}

export default class FastQuiz extends React.Component<void, Props, State> {
  state: State
  eachSecondInterval: number
  audioElement: any

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

  componentWillUpdate(nextProps: Props) {
    if (nextProps.newCardAction.actionId !==
        this.props.newCardAction.actionId) {
      this.audioElement.load()
      this.audioElement.play()
    }
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
    const wavUrl = this.props.speakUrlPrefix + es + ".wav"
    return <div>
      {this.props.newCardAction === null ? 'No cards' :
        <div>
          <p>{es}</p>
          <audio controls='controls'
              ref={element => { this.audioElement = element }}>
            <source src={wavUrl} />
          </audio>
          <div>Time: {this.state.secondsLeft}</div>
          <button onClick={this.onClickIRemember.bind(this)}>
            I Understand
          </button>
        </div>}
    </div>
  }
}
