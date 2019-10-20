import React, { Component } from 'react';
import Synth from './Synth';
import MenuComponent from './Menu';
import StartScreen from './StartScreen';
import Tone from 'tone';
import detectChrome from './isChrome';
import { Menu } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, {
      synthArray: [1],
      enableReverb: false,
      enableDebug: false,
      menuOpen: false
    }, props.config)
  }

  render() {
    const { enableReverb, enableDebug, configurableVariables, synthArray } = this.state
    const { volume, attack, decay, sustain, release } = configurableVariables.simple
    const synthOptions = {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: attack.value,
        decay: decay.volume,
        sustain: sustain.volume,
        release: release.volume
      }
    }
    const synthCollection = synthArray.map(() => new Tone.Synth(synthOptions))
    const reverb = new Tone.Freeverb().toMaster();
    if (enableReverb) {
      synthCollection.map(synth => synth.connect(reverb))
    } else {
      synthCollection.map(synth => synth.toMaster())
    }
    synthCollection.map(synth => synth.volume.value = volume.value)
    const reset = () => {
      synthCollection.map(synth => synth.dispose())
      reverb.dispose()
    }
    const changeProp = (key, section) => e => {
      const value = e.target.value / 100
      reset()
      const oldProp = configurableVariables[section][key]
      const newProp = Object.assign({}, oldProp, { value })
      const newSection = Object.assign({}, configurableVariables[section], {[key]: newProp })
      const newConfig = Object.assign({}, configurableVariables, {[section]: newSection})
      this.setState({configurableVariables: newConfig})
    }
    const toggleSetting = setting => () => {
      this.setState({ [setting]: !this.state[setting] })
    }
    const isInChordMode = synthArray.length > 1
    const setChords = () => {
      reset()
      this.setState({synthArray: isInChordMode ? [1] : [1, 2, 3]})
    }
    const toggleMenu = () => this.setState({menuOpen: !this.state.menuOpen})
    return detectChrome ? (
      <div>
        <StartScreen/>
        <div className='header'>
          <IconButton color='primary' className={'open-menu'} onClick={toggleMenu}>
            <Menu/>
          </IconButton>
          <h1>GyroSynth</h1>
        </div>
        <MenuComponent
          menuOpen={this.state.menuOpen}
          toggleMenu={toggleMenu}
          changeProp={changeProp}
          enableReverb={enableReverb}
          enableDebug={enableDebug}
          toggleSetting={toggleSetting}
          config={configurableVariables}
        />
        <div className='main-button chord-toggle' onClick={setChords}>{isInChordMode ? 'Chords' : 'Single note'}</div>
        <Synth
          config={this.state.configurableVariables}
          colorArray={this.state.colorArray}
          pitchArray={this.state.pitchArray}
          debuggerMode={enableDebug}
          synthCollection={synthCollection}
        />
      </div>
    ) : <StartScreen/>;
  }
}

export default App;
