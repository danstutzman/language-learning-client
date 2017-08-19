import type { Exposure } from './Exposure'
import type { Card } from './Card'
import React from 'react'

type Props = {
  topCard:      Card,
  addExposure:  (Exposure) => void,
  saveCardEdit: (Card) => void
}

type State = {
  showMnemonic: boolean,
  mnemonic: string
}

export default class FastQuiz extends React.Component<void, Props, State> {
  state: State

  constructor(props: Props) {
    super()
    this.state = {
      showMnemonic: false,
      mnemonic: props.topCard.mnemonic || ''
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ mnemonic: nextProps.topCard.mnemonic || '' })
  }

  _onClickIRemember() {
    this.props.addExposure({
      type:   'SLOW_NOD',
      cardId: this.props.topCard.cardId
    })
    this.setState({ showMnemonic: false })
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
    if (this.state.showMnemonic) {
      return <div className='horizontal-margins'>
        <textarea value={this.state.mnemonic}
          onChange={this._onChangeMnemonic.bind(this)} />
        <button className='big' onClick={()=>{this._onClickSave()}}>
          Save and Retry later
        </button>
      </div>
    } else {
      return <button className='big'
          onClick={this._onClickIRemember.bind(this)}>
        I Remember
      </button>
    }
  }

  render() {
    const topCard = this.props.topCard
    return <div>

      <p className='en'>{topCard.en}</p>

      <button className='big'
          onClick={()=>{ this.setState({ showMnemonic: true }) }}>
        Show Mnemonic
      </button>

      {this._renderMnemonicOrIRemember()}

    </div>
  }
}
