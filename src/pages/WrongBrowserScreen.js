import React, { Component } from 'react';
import { detect } from 'detect-browser';
import config from '../config';

class WrongBrowserScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const browserName = detect().name
    return (
      <div className='start-screen-container'>
        <h1>Welcome to GyroSynth!</h1>
        <div className='warning'>Warning</div>
        <p>It looks like you're using a <span className='current-browser-name'>{browserName}</span> browser right now.</p>
        <p>As of now GyroSynth only works on the following browsers due to limited device API support:</p>
        <ul className='supported-browser-list'>
          {config.supportedBrowsers.map((browerName, index) => <li key={index}><span>{browerName}</span></li>)}
        </ul>
      </div>
    );
  }
}

export default WrongBrowserScreen;
