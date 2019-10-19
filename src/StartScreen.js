import './StartScreen.css';
import React, { Component } from 'react';
import detectChrome from './isChrome';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
      hasMotion: false
    }
  }

  hasDeviceMotion() {
    const checkMotion = e => {
      const hasMotion = !!e.accelerationIncludingGravity.x
      this.setState({ hasMotion })
    }
    const hasMotion = this.state.hasMotion
    !hasMotion
      ? window.addEventListener('devicemotion', checkMotion)
      : window.removeEventListener("devicemotion", checkMotion);
  }

  render() {
    const { hasMotion, open } = this.state
    const close = () => this.setState({open: false})
    const isChrome = detectChrome()
    this.hasDeviceMotion()
    return (
      <div className={'start-screen ' + (!open && 'closed')}>
        <div className='start-screen-container'>
          <h1>Welcome to GyroSynth!</h1>
          {
            isChrome
              ? hasMotion
                ? <div>
                    <p>Hold your phone like a drumstick and hit the empty air in front of you to produce sound.</p>
                    <p>Rotate around yourself to change pitch.</p>
                    <div className='start-button main-button' onClick={close}>Let's go!</div>
                  </div>
                : <div>
                    <div className='warning'>Warning</div>
                    <p>We're getting no input from your gyroscope or accelerometer.</p>
                    <p>Make sure you're using a phone or tablet and that you have given us permissions to use the device gyroscope and accelerometer.</p>
                    <div className='proceed-anyway' onClick={close}>I want to proceed even though GyroSynth won't work correctly</div>
                  </div>
            : <div>
                <div className='warning'>Warning</div>
                <p>It looks like you're not using a Google Chrome browser right now.</p>
                <p>As of now GyroSynth only works in the Chrome browser due to limited device API support.</p>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default StartScreen;
