import type { Exposure } from '../Exposure'
import type { Card } from '../Card'
import React from 'react'
import { assertNonBlankStr } from '../assertType'

type Props = {
  topCard:     Card,
  addExposure: (Exposure) => void,
  playEs:      (string) => Promise<void>
}

type State = {
  secondsLeft: 'WAITING' | number,
  startedCounterMillis: number
}

export default class Listen extends React.Component<void, Props, State> {
  state: State
  eachSecondInterval: number

  constructor() {
    super()
    this.state = {
      secondsLeft: 'WAITING',
      startedCounterMillis: 0
    }
  }

  _restartCounter() {
    this.setState({
      secondsLeft: 3,
      startedCounterMillis: new Date().getTime()
    })

    window.clearInterval(this.eachSecondInterval)
    this.eachSecondInterval = window.setInterval(() => {
      this.setState(prevState => {
        if (prevState.secondsLeft === 'WAITING') {
          throw new Error("Interval shouldn't run if secondsLeft=WAITING")
        } else if (prevState.secondsLeft > 1) {
          return { secondsLeft: prevState.secondsLeft - 1 }
        } else {
          window.clearInterval(this.eachSecondInterval)
          this.props.addExposure({
            type: 'LISTEN_BLINK',
            es: this.props.topCard.es,
            promptedAt: this.state.startedCounterMillis,
            respondedAt: new Date().getTime()
          })
          return { secondsLeft: 'WAITING' }
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
      type: 'LISTEN_NOD',
      es: this.props.topCard.es,
      promptedAt: this.state.startedCounterMillis,
      respondedAt: new Date().getTime()
    })
    window.clearInterval(this.eachSecondInterval)
    this.setState({ secondsLeft: 'WAITING' })
  }

  render() {
    const es = this._getEs(this.props)
    return <div>
      <p className='es'>{es}</p>
      <button className='big' onClick={()=>{this.props.playEs(es)}}>
        Play
      </button>
      <div>Time: {this.state.secondsLeft}</div>
      <button className='big' onClick={this._onClickIRemember.bind(this)}>
        I Understand
      </button>
    </div>
  }
}
