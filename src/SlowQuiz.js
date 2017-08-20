import type { Exposure } from './Exposure'
import type { Card } from './Card'
import type { CardUpdate } from './CardUpdate'
import React from 'react'
import { STAGE1_COMPLETE_FIELDS, STAGE_TIME_THRESHOLD } from './Card'

type Props = {
  topCard:        Card,
  numCardsLeft:   number,
  saveCardUpdate: (cardId: number, CardUpdate) => void,
  addExposure:    (Exposure) => void,
  playEs:         (string) => Promise<void>
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

  _calcCardUpdate(stageNum: number, millisSinceLastSeen: number,
      success: boolean): CardUpdate {
    if (success && millisSinceLastSeen >= STAGE_TIME_THRESHOLD[stageNum + 1]) {
      return { stageNum: stageNum + 1 }
    } else if (!success && stageNum > STAGE1_COMPLETE_FIELDS) {
      return { stageNum: STAGE1_COMPLETE_FIELDS }
    } else {
      return (({}: any): CardUpdate) // workaround
    }
  }

  _onClickIRemember() {
    const { addExposure, playEs, saveCardUpdate, topCard } = this.props
    const respondedAt = new Date().getTime()

    this.setState({ showMnemonic: true })

    playEs(topCard.es).then(()=>{
      const cardUpdate = this._calcCardUpdate(
        topCard.stageNum, respondedAt - topCard.lastSeenAt, true)
      saveCardUpdate(topCard.cardId, cardUpdate)

      addExposure({
        type: 'SLOW_NOD',
        es: topCard.es,
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
    const respondedAt = new Date().getTime()
    const { topCard, saveCardUpdate } = this.props

    this.setState({ showMnemonic: false, showMnemonicHelp: false })

    const cardUpdate = this._calcCardUpdate(
      topCard.stageNum, respondedAt - topCard.lastSeenAt, true)
    saveCardUpdate(topCard.cardId, cardUpdate)

    this.props.addExposure({
      type: 'SLOW_SHAKE',
      es: this.props.topCard.es,
      promptedAt: this.state.showedPromptMillis,
      respondedAt
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

      <p>{this.props.numCardsLeft} cards left</p>

    </div>
  }
}
