import React, { Component } from 'react';
import { Menu } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import Synth from './Synth';
import MenuComponent from './Menu';
import StartScreen from './StartScreen';
import config from './config';
import constructSynth from './synthFunctions/constructSynth';
import getStructuredPitchArray from './synthFunctions/getStructuredPitchArray';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, {
      enableReverb: false,
      enableDebug: false,
      menuOpen: false
    }, config)
  }

  render() {
    const { enableReverb, enableDebug, configurableVariables, pitchArray, gravity, colorArray, menuOpen } = this.state
    const { tactileFeedbackPitchDuration } = this.state.configurableVariables.advanced
    const { volume } = this.state.configurableVariables.simple
    const synthObject = constructSynth({
      volumeValue: volume.value,
      enableReverb,
      structuredPitchArray: getStructuredPitchArray({ pitchArray, colorArray }),
      tactileFeedbackPitchDurationValue: tactileFeedbackPitchDuration.value
    })
    const changeProp = (key, section, realValue) => {
      const value = realValue
      synthObject.reset()
      const oldProp = configurableVariables[section][key]
      const newProp = Object.assign({}, oldProp, { value })
      const newSection = Object.assign({}, configurableVariables[section], {[key]: newProp })
      const newConfig = Object.assign({}, configurableVariables, {[section]: newSection})
      this.setState({configurableVariables: newConfig})
    }
    const toggleSetting = setting => () => {
      synthObject.reset()
      this.setState({ [setting]: !this.state[setting] })
    }
    const toggleMenu = () => {
      synthObject.reset()
      this.setState({menuOpen: !menuOpen})
    }
    return (
      <div>
        <StartScreen/>
        <div className='header'>
          <IconButton color='primary' className={'open-menu'} onClick={toggleMenu}>
            <Menu/>
          </IconButton>
          <h1>GyroSynth</h1>
        </div>
        <MenuComponent
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
          changeProp={changeProp}
          enableReverb={enableReverb}
          enableDebug={enableDebug}
          toggleSetting={toggleSetting}
          config={configurableVariables}
        />
        <Synth
          config={configurableVariables}
          colorArray={colorArray}
          pitchArray={pitchArray}
          debuggerMode={enableDebug}
          synthObject={synthObject}
          gravity={gravity}
        />
      </div>
    )
  }
}

export default App;
