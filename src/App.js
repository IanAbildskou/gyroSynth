import React, { Component } from 'react';
import './App.css';
import Tone from 'tone';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { alpha: '???', beta: '???', gamma: '???', pitch: 'A1' }

    this.synth = new Tone.MembraneSynth().toMaster()
    const handleOrientation = event => {
      const alpha = Math.floor(event.alpha)
      const beta = Math.floor(event.beta)
      const gamma = Math.floor(event.gamma)
      const pitchArray = ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3']
      const correctedGamme = gamma < -90 ? 180 : (gamma < 0 ? 0 : gamma)
      const pitch = pitchArray[Math.floor((correctedGamme/180) * (pitchArray.length - 1))]
      this.setState({
        alpha,
        beta,
        gamma,
        pitch
      })
    }
    window.addEventListener('devicemotion', event => {
      if (event.acceleration.x > 20) {
        this.synth.triggerAttackRelease(this.state.pitch, "8n")
      }
    });
    window.addEventListener("deviceorientation", handleOrientation, true);
  }

  render() {
    return (
      <div className="App">
        <h1>gyroSynth</h1>
        <div>pitch {this.state.pitch}, </div>
        <div>alpha {this.state.alpha}, </div>
        <div>beta {this.state.beta}, </div>
        <div>gamma {this.state.gamma}, </div>
      </div>
    );
  }
}

export default App;
