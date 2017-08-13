import React from 'react'
import LocalBank from './LocalBank'

type Props = {
  bank: LocalBank
}
 
class App extends React.Component<void, Props, void> {
  render() {
    const { bank } = this.props
    return (<ul>
      <li>unsyncedActions = {JSON.stringify(bank.unsyncedActions)}</li>
    </ul>)
  }
}

module.exports = App
