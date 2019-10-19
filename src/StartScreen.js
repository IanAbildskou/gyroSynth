import './StartScreen.css';
import React, { Component } from 'react';
import detectChrome from './isChrome';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true
    }
  }

  render() {
    const close = () => this.setState({open: false})
    const isChrome = detectChrome()
    return (
      <div className={'start-screen ' + (!this.state.open && 'closed')}>
        <div className='start-screen-container'>
          <h1>Welcome to GyroSynth!</h1>
          {
            isChrome
              ? <div>
                <p>Hold your phone like a drumstick and hit the empty air in front of you to produce sound.</p>
                <p>Rotate around yourself to change pitch.</p>
                <div className='start-button main-button' onClick={close}>Let's go!</div>
              </div>
            : <div>
                <p>It looks like you're not using a Google Chrome browser right now</p>
                <p>As of now GyroSynth only works in the Chrome browser due to limited device API support</p>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default StartScreen;
