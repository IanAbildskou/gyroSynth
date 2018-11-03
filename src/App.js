import React, { Component } from 'react';
import './App.css';
import Tone from 'tone';

class App extends Component {
  render() {
    var synth = new Tone.MembraneSynth().toMaster()

    //create a loop
    var loop = new Tone.Loop(function(time){
    	synth.triggerAttackRelease("C1", "8n", time)
    }, "4n")

    loop.start(0)
    Tone.Transport.start('+0.1')
    return (
      <div className="App">
        <h1>gyroSynth</h1>
      </div>
    );
  }
}

export default App;
