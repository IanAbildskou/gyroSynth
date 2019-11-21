import './StartScreen.css';
import React, { Component } from 'react';
import isSupportedBrowser from '../helpers/isSupportedBrowser';
import Tutorial from './Tutorial';
import WelcomeBack from './WelcomeBack';
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
    const { setLeftHanded, launchSynth } = this.props
    const close = () => {
      this.setState({open: false})
      this.props.close()
      window.localStorage.setItem('hasBeenHereBefore', true)
    }
    const isSupported = isSupportedBrowser()
    hasCheckedForMotion && window.removeEventListener('devicemotion', this.checkMotion);
    const forceAccess = () => this.setState({ forcedAccess: true });
    const hasBeenHereBefore = window.localStorage.getItem('hasBeenHereBefore')
    return (
      <div className={'start-screen ' + (!open && 'closed')}>
          {
            ((isSupported && hasMotion) || forcedAccess)
              ? hasBeenHereBefore
                ? <WelcomeBack launchSynth={launchSynth} close={close}/>
                : <Tutorial launchSynth={launchSynth} close={close} setLeftHanded={setLeftHanded}/>
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
