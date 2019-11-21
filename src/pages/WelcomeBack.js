import React, { Component } from 'react';

class WelcomeBack extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='start-screen-container'>
        <h1 className="welcome-back-header">Welcome back!</h1>
        <div className='start-button main-button' onClick={() => {
          this.props.launchSynth()
          this.props.close()
        }}>Fire up the synth!</div>
      </div>
    );
  }
}

export default WelcomeBack;
