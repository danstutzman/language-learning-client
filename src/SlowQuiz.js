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
  showMnemonic:       boolean,
  showMnemonicHelp:   boolean,
  mnemonic:           string,
  showedPromptMillis: number
}

export default class SlowQuiz extends React.Component<void, Props, State> {
  state: State

  constructor(props: Props) {
    super()
    this.state = {
      showMnemonic:       false,
      showMnemonicHelp:   false,
      mnemonic:           props.topCard.mnemonic || '',
      showedPromptMillis: new Date().getTime()
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      mnemonic: nextProps.topCard.mnemonic || '',
      showedPromptMillis: new Date().getTime()
    })
  }

  _onClickIRemember() {
    const respondedAt = new Date().getTime()
    this.setState({ showMnemonic: true })
    this.props.playEs(this.props.topCard.es).then(()=>{
      this.props.addExposure({
        type: 'SLOW_NOD',
        es: this.props.topCard.es,
        promptedAt: this.state.showedPromptMillis,
        respondedAt
      })
      this.setState({ showMnemonic: false, showMnemonicHelp: false })
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
    this.setState({ showMnemonic: false, showMnemonicHelp: false })
    this.props.saveCardEdit(
        Object.assign({}, this.props.topCard, this.state))
    this.props.addExposure({
      type: 'SLOW_SHAKE',
      es: this.props.topCard.es,
      promptedAt: this.state.showedPromptMillis,
      respondedAt: new Date().getTime()
    })
  }

  _toggleShowMnemonicHelp() {
    this.setState(prevState => {
      return { showMnemonicHelp: !prevState.showMnemonicHelp }
    })
  }

  _onClickShowMnemonic() {
    this.props.playEs(this.props.topCard.es)
    this.setState({ showMnemonic: true })
  }

  _renderMnemonicOrIRemember() {
    const topCard = this.props.topCard
    if (this.state.showMnemonic) {
      return <div className='horizontal-margins'>
        <textarea value={this.state.mnemonic}
          onChange={this._onChangeMnemonic.bind(this)} />
        <button onClick={this._toggleShowMnemonicHelp.bind(this)}>
          Help
        </button>

        {this.state.showMnemonicHelp &&<div>
					<p>
						<span>Example for </span>
						<span className='en'>pen</span>
						<span> &rarr; </span>
						<span className='es'>pluma</span>
						<span>:</span>
					</p>
					<div className='horizontal-margins'>
						<blockquote>pen&apos;s end has feather plumage</blockquote>
					</div>
        </div>}

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

  render() {
    const topCard = this.props.topCard
    return <div>

      <p className='en'>{topCard.en}</p>

      {this._renderMnemonicOrIRemember()}

    </div>
  }
}
