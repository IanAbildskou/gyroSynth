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
      chords: false,
      enableReverb: false,
      enableDebug: false,
      menuOpen: false
    }, props.config)
  }

  render() {
    const { enableReverb, enableDebug, configurableVariables, chords } = this.state
    const { volume } = configurableVariables.simple
    const synthOptions = {
      oscillator: {
        type: 'square',
        modulationIndex: 2,
        modulationType: 'triangle',
        harmonicity: 0.5
      },
      filter : {
        Q: 1,
        type: 'lowpass',
        rolloff: -24
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.4,
        release: 2
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.8,
        release: 1.5,
        baseFrequency: 50,
        octaves: 4,
        exponent: 2
      }
    }
    const synthConstructor = Tone.MonoSynth
    const synth = chords ? new Tone.PolySynth(3, synthConstructor, synthOptions) : new synthConstructor(synthOptions)
    const reverb = new Tone.Freeverb().toMaster();
    if (enableReverb) {
      synth.connect(reverb)
    } else {
      synth.toMaster()
    }
    synth.volume.value = volume.value
    const reset = () => {
      synth.dispose()
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
    const setChords = () => {
      reset()
      this.setState({chords: !chords})
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
      <div className='main-button chord-toggle' onClick={setChords}>{chords ? 'Chords' : 'Single note'}</div>
        <Synth
          config={this.state.configurableVariables}
          colorArray={this.state.colorArray}
          pitchArray={this.state.pitchArray}
          debuggerMode={enableDebug}
          synthCollection={synth}
          chords={chords}
        />
      </div>
    ) : <StartScreen/>;
  }
}

export default App;
