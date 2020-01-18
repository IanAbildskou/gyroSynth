import React, { Component } from 'react';
import { Menu } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import Synth from './pages/Synth';
import MenuComponent from './pages/Menu';
import config from './config';
import constructSynth from './synthFunctions/constructSynth';
import getStructuredPitchArray from './synthFunctions/getStructuredPitchArray';

class SynthContainer extends Component {
  constructor(props) {
    super(props)
    const enableReverb = window.localStorage.getItem('enableReverb')
    const enableDebug = window.localStorage.getItem('enableDebug')
    const enableDrumMode = window.localStorage.getItem('enableDrumMode')
    const configurableVariables = JSON.parse(window.localStorage.getItem('configurableVariables'))
    this.state = Object.assign({}, {
      enableReverb: enableReverb || false,
      enableDebug: enableDebug || false,
      enableDrumMode: enableDrumMode || true,
      menuOpen: false
    }, config, configurableVariables ? { configurableVariables } : {})
  }

  render() {
    const { enableReverb, enableDebug, enableDrumMode, configurableVariables, pitchArray, gravity, colorArray, menuOpen } = this.state
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
      window.localStorage.setItem('configurableVariables', JSON.stringify(newConfig))
      this.setState({configurableVariables: newConfig})
    }
    const reset = () => this.setState({
      configurableVariables: config.configurableVariables,
      enableReverb: false,
      enableDebug: false,
      enableDrumMode: true
    })
    const toggleSetting = setting => () => {
      synthObject.reset()
      const newValue = !this.state[setting]
      window.localStorage.setItem(setting, newValue )
      this.setState({ [setting]: !this.state[setting] })
    }
    const toggleMenu = () => {
      synthObject.reset()
      this.setState({menuOpen: !menuOpen})
    }
    return (
      <div>
        <div className='header'>
          <IconButton color='primary' className={'open-menu'} onClick={toggleMenu}>
            <Menu/>
          </IconButton>
        </div>
        <MenuComponent
          launchStartScreen={this.props.launchStartScreen}
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
          changeProp={changeProp}
          enableReverb={enableReverb}
          enableDebug={enableDebug}
          enableDrumMode={enableDrumMode}
          toggleSetting={toggleSetting}
          config={configurableVariables}
          reset={reset}
        />
        <Synth
          config={configurableVariables}
          colorArray={colorArray}
          pitchArray={pitchArray}
          debuggerMode={enableDebug}
          enableDrumMode={enableDrumMode}
          synthObject={synthObject}
          gravity={gravity}
          leftHanded={this.props.leftHanded}
        />
      </div>
    )
  }
}

export default SynthContainer;
