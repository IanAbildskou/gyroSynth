import React, { Component } from 'react';
import StartScreen from './StartScreen';
import SynthContainer from './SynthContainer';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      introFinished: false
    }
  }

  render() {
    const { introFinished } = this.state
    return (
      <div>
        <StartScreen finishIntro={() => this.setState({ introFinished: true })}/>
        {introFinished && <SynthContainer/>}
      </div>
    )
  }
}

export default App;
