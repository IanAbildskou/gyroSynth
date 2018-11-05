import React, { Component } from 'react';
import './App.css';
import Synth from './Synth';
import Tone from 'tone';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pitchDecay: 0.5,
      octaves: 10,
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 0.4,
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

    const synth = new Tone.MembraneSynth(synthOptions).toMaster()

    const setPitchDecay = prop => e => {
      const value = e.target.value / 100
      synth.dispose()
      this.setState({[prop]: value})
    }
    return (
      <div>
        <h1>gyroSynth</h1>
        <Synth synth={synth}></Synth>
        {
          settingsArray.map(setting => {
            return (
              <div key={setting.prop} className="slidecontainer">
                {setting.prop}
                <input type="range" min={setting.min} max={setting.max} className="slider" id="myRange" onChange={setPitchDecay(setting.prop)}/>
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default App;
