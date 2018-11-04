import React, { Component } from 'react';
import './App.css';
import Tone from 'tone';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      beta: undefined,
      history: []
    }

    const synth = new Tone.MembraneSynth().toMaster()

    window.addEventListener("deviceorientation", event => {
      const beta = Math.floor(event.beta)
      this.setState({beta})
    }, true)

    window.addEventListener('devicemotion', event => {
      const accX = Math.floor(event.accelerationIncludingGravity.x)
      const enoughForce = accX < -20
      const oldHistory = this.state.history
      const isPeak = enoughForce && oldHistory.length && (accX > oldHistory[oldHistory.length -1].accX)
      const hasNotFiredRecently = isPeak && !oldHistory.slice(oldHistory.length - 5).map(o => o.fire).includes(true)
      const fire = hasNotFiredRecently
      if (fire) {
        const pitchArray = ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3']
        const beta = this.state.beta
        const correctedBeta = beta < -90 ? 180 : (beta < 0 ? 0 : beta)
        const pitch = pitchArray[Math.floor((correctedBeta/180) * (pitchArray.length - 1))]
        synth.triggerAttackRelease(pitch, "8n")
      }
      this.setState({history: oldHistory.concat([{accX, fire}])})
    })
  }

  render() {
    return (
      <div className="App">
        <h1>gyroSynth</h1>
      </div>
    );
  }
}

export default App;
