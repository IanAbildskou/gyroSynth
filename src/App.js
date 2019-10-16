import React, { Component } from 'react';
import './App.css';
import Synth from './Synth';
import Menu from './Menu';
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
    }
  }

  render() {
    const { defaultVolume } = this.props.config
    const {attack, decay, sustain, release} = this.state
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
        <Menu changeProp={changeProp} config={this.props.config}/>
        <div className='chord-toggle' onClick={setChords}>{isInChordMode ? 'Chords' : 'Single note'}</div>
        <Synth config={this.props.config} synthCollection={synthCollection}/>
      </div>
    );
  }
}

export default App;
