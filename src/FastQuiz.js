import React from 'react'
import type { Card } from './Card'

type Props = {
  card: Card | null
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

  render() {
    return <div>
      {this.props.card === null ? 'No cards' :
        <div>
          <p>Translate the following to Spanish:</p>
          <p>{this.props.card.en}</p>
          <div>Time: {this.state.secondsLeft}</div>
        </div>}
    </div>
  }
}
