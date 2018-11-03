import React, { Component } from 'react';
import './App.css';
import Tone from 'tone';
import LiveStats from './LiveStats';
import SaveStats from './SaveStats';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alpha: '???',
      beta: '???',
      gamma: '???',
      accX: '???',
      accY: '???',
      accZ: '???',
      pitch: 'A1',
      history: []
    }

    const synth = new Tone.MembraneSynth().toMaster()

    window.addEventListener("deviceorientation", event => {
      const alpha = Math.floor(event.alpha)
      const beta = Math.floor(event.beta)
      const gamma = Math.floor(event.gamma)
      const pitchArray = ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3']
      const correctedGamme = gamma < -90 ? 180 : (gamma < 0 ? 0 : gamma)
      const pitch = pitchArray[Math.floor((correctedGamme/180) * (pitchArray.length - 1))]
      this.setState({alpha, beta, gamma, pitch})
    }, true)

    window.addEventListener('devicemotion', event => {
      const {accX, accY, accZ} = event.accelerationIncludingGravity
      const interval = event.interval
      const pitch = this.state.pitch
      const history = this.state.history.concat([{
        accX,
        accY,
        accZ,
        alpha: this.state.alpha,
        beta: this.state.beta,
        gamma: this.state.gamma,
        pitch,
        interval
      }])
      this.setState({accX, accY, accZ, history})
      if (Math.max(accX, accY, accZ) > 20) {
        synth.triggerAttackRelease(pitch, "8n")
      }
    })
  }

  render() {
    return (
      <div className="App">
        <h1>gyroSynth</h1>
        <LiveStats stats={this.state}/>
        <SaveStats history={this.state.history}/>
      </div>
    );
  }
}

export default App;
