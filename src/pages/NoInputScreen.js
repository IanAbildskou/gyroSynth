import React, { Component } from 'react';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='start-screen-container'>
        <h1>Welcome to GyroSynth!</h1>
        <div className='warning'>Warning</div>
        <p>We're getting no input from your gyroscope or accelerometer.</p>
        <p>Make sure you're using a phone or tablet and that you have given us permissions to use the device gyroscope and accelerometer.</p>
        <div className='proceed-anyway' onClick={this.props.close}>I want to proceed even though GyroSynth won't work correctly</div>
      </div>
    );
  }
}

export default StartScreen;
