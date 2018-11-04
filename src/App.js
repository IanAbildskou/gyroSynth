import React, { Component } from 'react';
import './App.css';
import Tone from 'tone';
// import LiveStats from './LiveStats';
// import SaveStats from './SaveStats';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // alpha: '???',
      // beta: '???',
      gamma: '???',
      // accX: '???',
      // accY: '???',
      // accZ: '???',
      // pitch: 'A1',
      history: []
    }

    const synth = new Tone.MembraneSynth().toMaster()

    window.addEventListener("deviceorientation", event => {
      // const alpha = Math.floor(event.alpha)
      // const beta = Math.floor(event.beta)
      const gamma = Math.floor(event.gamma)
      this.setState({
        // alpha,
        // beta,
        gamma
        // spitch
      })
    }, true)

    window.addEventListener('devicemotion', event => {
      // const {x, y, z} = event.accelerationIncludingGravity
      const accX = Math.floor(event.accelerationIncludingGravity.x)
      // const accY = Math.floor(y)
      // const accZ = Math.floor(z)
      // const interval = event.interval
      // const pitch = this.state.pitch
      const oldHistory = this.state.history
      const enoughForce = accX < -20
      const isPeak = enoughForce && oldHistory.length && (accX > oldHistory[oldHistory.length -1].accX)
      const hasNotFiredRecently = isPeak && !oldHistory.slice(oldHistory.length - 5).map(o => o.fire).includes(true)
      const fire = hasNotFiredRecently
      const gamma = this.state.gamma
      const history = oldHistory.concat([{
        accX,
        // accY,
        // accZ,
        // alpha: this.state.alpha,
        // beta: this.state.beta,
        gamma,
        // pitch,
        // interval,
        fire
      }])

      this.setState({
        // accX,
        // accY,
        // accZ,
        history
      })

      if (fire) {
        const pitchArray = ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3']
        const correctedGamme = gamma < -90 ? 180 : (gamma < 0 ? 0 : gamma)
        const pitch = pitchArray[Math.floor((correctedGamme/180) * (pitchArray.length - 1))]
        synth.triggerAttackRelease(pitch, "8n")
      }
    })
  }

  // <LiveStats stats={this.state}/>
  // <SaveStats history={this.state.history}/>

  render() {
    return (
      <div className="App">
        <h1>gyroSynth</h1>
      </div>
    );
  }
}

export default App;
