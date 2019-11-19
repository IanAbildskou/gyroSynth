import React, { Component } from 'react';
import StartScreen from './StartScreen';
import SynthContainer from './SynthContainer';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      introFinished: false,
      removeStartScreen: false
    }
  }

  render() {
    const { introFinished, removeStartScreen } = this.state
    introFinished && !removeStartScreen && setTimeout(() => this.setState({ removeStartScreen: true }), 1000);
    return (
      <div>
        {!removeStartScreen && <StartScreen finishIntro={() => this.setState({ introFinished: true })}/>}
        {introFinished && <SynthContainer/>}
      </div>
    )
  }
}

export default App;
