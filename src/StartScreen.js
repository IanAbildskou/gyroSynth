import './StartScreen.css';
import React, { Component } from 'react';
import isSupportedBrowser from './isSupportedBrowser';
import Tutorial from './pages/Tutorial';
import NoInputScreen from './pages/NoInputScreen';
import WrongBrowserScreen from './pages/WrongBrowserScreen';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.checkMotion = this.checkMotion.bind(this);
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
    hasCheckedForMotion && window.removeEventListener('devicemotion', this.checkMotion);
    return (
      <div className={'start-screen ' + (!open && 'closed')}>
          {
            isSupported
              ? hasMotion
                ? <Tutorial close={close}/>
                : <NoInputScreen close={close}/>
            : <WrongBrowserScreen/>
          }
      </div>
    );
  }
}

export default StartScreen;
