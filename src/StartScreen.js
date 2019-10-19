import './StartScreen.css';
import React, { Component } from 'react';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true
    }
  }

  render() {
    const close = () => this.setState({open: false})
    return (
      <div className={'start-screen ' + (!this.state.open && 'closed')}>
        <div className='start-screen-container'>
          <h1>Welcome to GyroSynth!</h1>
          <p>Make sure you're using the Chrome browser on a smartphone, right now.</p>
          <p>Hold your phone like a drumstick and hit the empty air in front of you to produce sound.</p>
          <p>Rotate around yourself to change pitch.</p>
          <div className='start-button main-button' onClick={close}>Let's go!</div>
        </div>
      </div>
    );
  }
}

export default StartScreen;
