import React, { Component } from 'react';
import './App.css';
import Synth from './Synth';
import Menu from './Menu';
import Tone from 'tone';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, {
      synthArray: [1],
    }, props.config)
  }

  render() {
    const { volume, attack, decay, sustain, release } = this.state.configurableVariables.simple
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
    const reverb = new Tone.Freeverb().toMaster();
    const synthCollection = this.state.synthArray.map(() => new Tone.Synth(synthOptions).connect(reverb))
    synthCollection.map(synth => {
      synth.volume.value = defaultVolume
      return synth
    })
    const reset = () => {
      synthCollection.map(synth => synth.dispose())
      reverb.dispose()
    }
    const changeProp = prop => e => {
      const value = e.target.value / 100
      reset()
      const configurableVariables = this.state.configurableVariables
      const oldProp = configurableVariables[section][key]
      const newProp = Object.assign({}, oldProp, { value })
      const newSection = Object.assign({}, configurableVariables[section], {[key]: newProp })
      const newConfig = Object.assign({}, configurableVariables, {[section]: newSection})
      this.setState({configurableVariables: newConfig})
    }
    const isInChordMode = this.state.synthArray.length > 1

    const setChords = () => {
      reset()
      this.setState({synthArray: isInChordMode ? [1] : [1, 2, 3]})
    }
    return (
      <div>
        <Menu changeProp={changeProp} config={this.state.configurableVariables}/>
        <div className='main-button chord-toggle' onClick={setChords}>{isInChordMode ? 'Chords' : 'Single note'}</div>
        <Synth
          config={this.state.configurableVariables}
          colorArray={this.state.colorArray}
          pitchArray={this.state.pitchArray}
          debuggerMode={this.state.debuggerMode}
          synthCollection={synthCollection}
          />
      </div>
    );
  }
}

export default App;
