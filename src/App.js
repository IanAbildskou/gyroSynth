import React, { Component } from 'react';
import StartScreen from './pages/StartScreen';
import SynthContainer from './SynthContainer';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      launchSynth: false,
      removeStartScreen: false,
      leftHanded: true,
      startScreenClosed: false
    }
  }

  render() {
    const { launchSynth, removeStartScreen, leftHanded, startScreenClosed } = this.state
    startScreenClosed && !removeStartScreen && setTimeout(() => this.setState({ removeStartScreen: true }), 1000);
    const setLeftHanded = bool => this.setState({ leftHanded: bool })
    const launchStartScreen = () => this.setState({ removeStartScreen: false, startScreenClosed: false })
    return (
      <div>
        {!removeStartScreen && <StartScreen close={() => this.setState({ startScreenClosed: true })} setLeftHanded={setLeftHanded} launchSynth={() => this.setState({ launchSynth: true })}/>}
        {launchSynth && <SynthContainer launchStartScreen={launchStartScreen} leftHanded={leftHanded}/>}
      </div>
    )
  }
}

export default App;
