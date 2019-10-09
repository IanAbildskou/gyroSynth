import React, { Component } from 'react';
import './App.css';
import Synth from './Synth';
import Tone from 'tone';

class App extends Component {
  constructor(props) {
    super(props)
    const { defaultAttack, defaultSustain, defaultRelease, defaultDecay } = props.config
    this.state = {
      synthArray: [1],
      attack: defaultAttack,
      decay: defaultDecay,
      sustain: defaultSustain,
      release: defaultRelease,
      menuOpen: false
    }
  }

  render() {
    const { defaultVolume, minAttack, maxAttack, minDecay, maxDecay, minSustain, maxSustain, minRelease, maxRelease } = this.props.config
    const {attack, decay, sustain, release} = this.state
    const settingsArray = [
      {prop: 'attack', min: minAttack, max: maxAttack},
      {prop: 'decay', min: minDecay, max: maxDecay},
      {prop: 'sustain', min: minSustain, max: maxSustain},
      {prop: 'release', min: minRelease, max: maxRelease},
    ]
    const synthOptions = {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack,
        decay,
        sustain,
        release
      }
    }
    const synthCollection = this.state.synthArray.map(() => new Tone.Synth(synthOptions).toMaster())
    synthCollection.map(synth => synth.volume.value = defaultVolume)
    const reset = () => synthCollection.map(synth => synth.dispose())
    const changeProp = prop => e => {
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
                  <input defaultValue={this.state[setting.prop] * 100} type="range" min={setting.min} max={setting.max} className="slider" id="myRange" onChange={changeProp(setting.prop)}/>
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
      <Synth config={this.props.config} synthCollection={synthCollection}></Synth>
      </div>
    );
  }
}

export default App;
