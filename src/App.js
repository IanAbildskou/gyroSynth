import React, { Component } from 'react';
import './App.css';
import Synth from './Synth';
import Tone from 'tone';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      synthArray: [1],
      pitchDecay: 0.01,
      octaves: 0.1,
      attack: 0.01,
      decay: 1,
      sustain: 0.01,
      release: 0.1,
      menuOpen: false
    }
  }

  render() {
    const {pitchDecay, octaves, attack, decay, sustain, release} = this.state
    const settingsArray = [
      {prop: 'pitchDecay', min: 1, max: 99},
      {prop: 'octaves', min: 10, max: 500},
      {prop: 'attack', min: 1, max: 80},
      {prop: 'decay', min: 10, max: 1000},
      {prop: 'sustain', min: 1, max: 100},
      {prop: 'release', min: 10, max: 100},
    ]
    const synthOptions = {
      pitchDecay,
      octaves,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack,
        decay,
        sustain,
        release,
        attackCurve: 'exponential'
      }
    }

    const synthCollection = this.state.synthArray.map(() => new Tone.MembraneSynth(synthOptions).toMaster())
    const reset = () => synthCollection.map(synth => synth.dispose())
    const setPitchDecay = prop => e => {
      const value = e.target.value / 100
      reset()
      this.setState({[prop]: value})
    }
    const isInChordMode = this.state.synthArray.length > 1

    const setChords = () => {
      reset()
      this.setState({synthArray: isInChordMode ? [1] : [1, 2, 3]})
    }
    return (
      <div>
        <div className={'menu' + (this.state.menuOpen ? ' open' : '')}>
          {
            settingsArray.map(setting => {
              return (
                <div key={setting.prop} className="slidecontainer">
                  <div className='setting-name'>{setting.prop}</div>
                  <input defaultValue={this.state[setting.prop] * 100} type="range" min={setting.min} max={setting.max} className="slider" id="myRange" onChange={setPitchDecay(setting.prop)}/>
                </div>
              )
            })
          }
          <div className='header' onClick={() => this.setState({menuOpen: !this.state.menuOpen})}>
            <svg className='arrow' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70.71 49.5">
              <polygon points="35.35 21.21 14.14 0 0 14.14 35.35 49.5 70.71 14.14 56.57 0 35.35 21.21"/>
            </svg>
            <h1>gyroSynth</h1>
          </div>
        </div>
      <div className='chord-toggle' onClick={setChords}>{isInChordMode ? 'Chords' : 'Single note'}</div>
      <Synth synthCollection={synthCollection}></Synth>
      </div>
    );
  }
}

export default App;
