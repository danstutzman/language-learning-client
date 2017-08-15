import React from 'react'
import type { Card } from './Card'

type Props = {
  cards:   {[actionId: number]: Card},
  addCard: (Card) => void,
  sync:    () => void
}

type State = {
  newGender: string,
  newEs: string,
  newEn: string
}

class App extends React.Component<void, Props, State> {
  state: State

  constructor() {
    super()
    this.state = {
      newGender: '',
      newEs:     '',
      newEn:     ''
    }
  }

  onClickAddCard(e: Event) {
    e.preventDefault()
    const { newGender, newEs, newEn } = this.state
    if (newGender === 'M' || newGender === 'F') {
      this.props.addCard({
        type:   'EsN',
        gender: newGender,
        es:     newEs,
        en:     newEn
      })
    }
  }

  render() {
    const { cards, sync } = this.props
    const { newGender, newEs, newEn } = this.state
    return <div>
      <table>
        <thead>
          <tr>
            <th>actionId</th>
            <th>type</th>
            <th>gender</th>
            <th>es</th>
            <th>en</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(cards).map(actionId => {
            const card = cards[parseInt(actionId)]
            return <tr key={actionId}>
              <td>{actionId}</td>
              <td>{card.type}</td>
              <td>{card.gender}</td>
              <td>{card.es}</td>
              <td>{card.en}</td>
            </tr>
          })}
          <tr>
            <td>(new)</td>
            <td>EsN</td>
            <td>
              <input value={newGender} onChange={e =>
                this.setState({newGender: e.target.value})}/>
            </td>
            <td>
              <input value={newEs} onChange={e =>
                this.setState({newEs: e.target.value})}/>
            </td>
            <td>
              <input value={newEn} onChange={e =>
                this.setState({newEn: e.target.value})}/>
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={this.onClickAddCard.bind(this)}>Add Card</button>
      <button onClick={sync}>Sync</button>
    </div>
  }
}

export default App
