import './StartScreen.css';
import React, { Component } from 'react';
import { ArrowForward } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

class About extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className={'start-screen about-page ' + (!this.props.open && 'closed')}>
        <div className='start-screen-container'>
          <IconButton color='primary' className={'close-menu'} onClick={this.props.toggleAbout}>
            <ArrowForward/>
          </IconButton>
          <h1>About</h1>
          <p>GyroSynth is a synthesizer that runs on and is controlled by your phone. It uses the gyroscope and accelerometer in your device, enabling you to play music by waving your phone around in front of you.</p>
          <p>GyroSynth is developed and maintained by <a href="https://ianvictor.dk">Ian</a>.</p>
          <p>If you want to get in touch, you can shoot us an email at <a href="mailto:ianabildskou@gmail.com">ianabildskou@gmail.com</a>.</p>
          <p>You can follow the development of GyroSynth on our <a href="https://trello.com/b/4lPWKKE3/gyrosynth">Trello board</a>.</p>
          <p>You can report bugs or do feature requests on our <a href="https://github.com/IanAbildskou/gyroSynth/issues">Github</a>.</p>
        </div>
      </div>
    );
  }
}

export default About;
