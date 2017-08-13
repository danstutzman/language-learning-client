const React = require('react')
const LocalBank = require('./LocalBank')

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
