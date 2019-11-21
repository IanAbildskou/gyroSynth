import './StartScreen.css';
import React, { Component } from 'react';
import isSupportedBrowser from '../helpers/isSupportedBrowser';
import Tutorial from './Tutorial';
import NoInputScreen from './NoInputScreen';
import WrongBrowserScreen from './WrongBrowserScreen';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.checkMotion = this.checkMotion.bind(this);
    this.state = {
      open: true,
      hasMotion: false,
      hasCheckedForMotion: false,
      forcedAccess: false
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
    const { hasMotion, open, hasCheckedForMotion, forcedAccess } = this.state
    const close = () => {
      this.setState({open: false})
      this.props.close()
    }
    const isSupported = isSupportedBrowser()
    hasCheckedForMotion && window.removeEventListener('devicemotion', this.checkMotion);
    const forceAccess = () => this.setState({ forcedAccess: true });
    return (
      <div className={'start-screen ' + (!open && 'closed')}>
          {
            ((isSupported && hasMotion) || forcedAccess)
              ? <Tutorial launchSynth={this.props.launchSynth} close={close} setLeftHanded={this.props.setLeftHanded}/>
              : <div className='start-screen-container'>
                  <h1>Welcome to GyroSynth!</h1>
                  <div className='warning'>Warning</div>
                  {
                    isSupported
                      ? <div>
                        <NoInputScreen/>
                        <div className='proceed-anyway' onClick={forceAccess}>I want to proceed even though GyroSynth won't work correctly</div>
                      </div>
                      : <WrongBrowserScreen/>
                  }

                </div>
          }
      </div>
    );
  }
}

export default StartScreen;
