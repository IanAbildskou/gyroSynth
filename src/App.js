import React, { Component } from 'react';
import './App.css';
import Tone from 'tone';

class App extends Component {
  render() {
    //create a synth and connect it to the master output (your speakers)
    var synth = new Tone.Synth().toMaster()

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease('C4', '8n')
    return (
      <div className="App">
        <h1>gyroSynth</h1>
      </div>
    );
  }
}

export default App;
