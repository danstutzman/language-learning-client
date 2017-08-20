import React from 'react'

type Props = {
  cardStagesSummary: {[stageNumAndReady: string]: number},
  startSpeak:        () => void
}

type State = {
}

export default class SpeakSummary
    extends React.Component<void, Props, State> {
  state: State

  render() {
    const { cardStagesSummary } = this.props

    return <div>

      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
          </tr>
        </thead>
        <tbody>
          <tr key='ready'>
            <td></td>
            {[1, 2, 3, 4, 5].map(stageNum => {
              return <td key={stageNum}>
                {cardStagesSummary[`${stageNum}T`]}
              </td>})}
            <td>
              <button className='big' onClick={this.props.startSpeak}>
                Start
              </button>
            </td>
          </tr>
          <tr key='later'>
            <td></td>
            {[1, 2, 3, 4, 5].map(stageNum => {
              return <td key={stageNum}>
                {cardStagesSummary[`${stageNum}F`]}
              </td>})}
          </tr>
        </tbody>
      </table>
    </div>
  }
}
