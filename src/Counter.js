const React = require('react')
 
class Counter extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0,
    }
  }
 
  render() {
    return (
      <button
        onClick={() => {
          this.setState({ count: this.state.count + 1 })
        }}>
        Count: {this.state.count}
      </button>
    )
  }
}

module.exports = Counter
