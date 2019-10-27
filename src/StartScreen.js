import './StartScreen.css';
import React, { Component } from 'react';
import isSupportedBrowser from './isSupportedBrowser';
import { detect } from 'detect-browser';
import config from './config';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
      hasMotion: false,
      hasCheckedForMotion: false
    }
  }

  checkMotion = e => {
    if (!this.state.hasCheckedForMotion) {
      const { x: xg, y: yg, z: zg } = e.accelerationIncludingGravity
      const { x, y, z } = e.acceleration
      const hasMotion = !!xg || !!yg || !!zg || !!x || !!y || !!z
      this.setState({ hasMotion, hasCheckedForMotion: true })
    }
  }

  componentDidMount() {
    window.addEventListener('devicemotion', this.checkMotion)
  }

  render() {
    const { hasMotion, open, hasCheckedForMotion } = this.state
    const close = () => {
      this.setState({open: false})
      this.props.finishIntro()
    }
    const isSupported = isSupportedBrowser()
    const browserName = detect().name
    hasCheckedForMotion && window.removeEventListener('devicemotion', this.checkMotion);
    return (
      <div className={'start-screen ' + (!open && 'closed')}>
        <div className='start-screen-container'>
          <h1>Welcome to GyroSynth!</h1>
          {
            isSupported
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
                <p>It looks like you're using a <span className='current-browser-name'>{browserName}</span> browser right now.</p>
                <p>As of now GyroSynth only works on the following browsers due to limited device API support:</p>
                <ul className='supported-browser-list'>
                  {config.supportedBrowsers.map((browerName, index) => <li key={index}><span>{browerName}</span></li>)}
                </ul>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default StartScreen;
