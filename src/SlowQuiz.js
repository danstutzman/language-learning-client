import type { Exposure } from './Exposure'
import type { Card } from './Card'
import React from 'react'

type Props = {
  topCard:      Card,
  addExposure:  (Exposure) => void,
  saveCardEdit: (Card) => void,
  playEs:       (string) => Promise<void>
}

type State = {
  showMnemonic:  boolean,
  mnemonic:      string
}

export default class FastQuiz extends React.Component<void, Props, State> {
  state: State

  constructor(props: Props) {
    super()
    this.state = {
      showMnemonic:  false,
      mnemonic:      props.topCard.mnemonic || ''
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ mnemonic: nextProps.topCard.mnemonic || '' })
  }

  _onClickIRemember() {
    this.setState({ showMnemonic: true })
    this.props.playEs(this.props.topCard.es).then(()=>{
      this.props.addExposure({
        type:   'SLOW_NOD',
        cardId: this.props.topCard.cardId
      })
      this.setState({ showMnemonic: false })
    })
  }

  _onChangeMnemonic(e: Event & { target: HTMLInputElement }) {
    const newValue = e.target.value
    this.setState({ mnemonic: newValue })
    if (newValue.slice(-1) === '\n') {
      this._onClickSave()
    }
  }

  _onClickSave() {
    this.setState({ showMnemonic: false })
    this.props.saveCardEdit(
        Object.assign({}, this.props.topCard, this.state))
    this.props.addExposure({
      type:   'SLOW_SHAKE',
      cardId: this.props.topCard.cardId
    })
  }

  _renderMnemonicOrIRemember() {
    const topCard = this.props.topCard
    if (this.state.showMnemonic) {
      return <div className='horizontal-margins'>
        <textarea value={this.state.mnemonic}
          onChange={this._onChangeMnemonic.bind(this)} />
        <p className='es'>{topCard.es}</p>
        <button className='big' onClick={()=>{this.props.playEs(topCard.es)}}>
          Replay sound
        </button>
        <button className='big' onClick={()=>{this._onClickSave()}}>
          Save and Retry later
        </button>
      </div>
    } else {
      return <div>
        <button className='big' onClick={this._onClickShowMnemonic.bind(this)}>
          Show Mnemonic
        </button>
        <button className='big'
          onClick={this._onClickIRemember.bind(this)}>
          I Remember
        </button>
      </div>
    }
  }

  _onClickShowMnemonic() {
    this.props.playEs(this.props.topCard.es)
    this.setState({ showMnemonic: true })
  }

  render() {
    const topCard = this.props.topCard
    return <div>

      <p className='en'>{topCard.en}</p>

      {this._renderMnemonicOrIRemember()}

    </div>
  }
}
