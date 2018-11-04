import React, { Component } from 'react';
import './App.css';
import Tone from 'tone';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      beta: undefined,
      history: [],
      release: false
    }

    this.synth = new Tone.MembraneSynth().toMaster()

    window.addEventListener("deviceorientation", event => {
      const beta = Math.floor(event.beta)
      this.setState({beta})
    }, true)

    window.addEventListener('devicemotion', event => {
      const triggerThreshold = 15
      const accX = -(Math.floor(event.accelerationIncludingGravity.x))
      const enoughForce = accX > triggerThreshold
      const oldHistory = this.state.history
      const refinedHistory = oldHistory.length > 100 ? oldHistory.slice(oldHistory.length - 5) : oldHistory
      const isPeak = enoughForce && refinedHistory.length && (accX < refinedHistory[refinedHistory.length -1].accX)
      const hasNotFiredRecently = isPeak && !refinedHistory.slice(refinedHistory.length - 5).map(o => o.fire).includes(true)
      const fire = hasNotFiredRecently
      if (fire) {
        const pitchArray = ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3']
        const beta = this.state.beta
        const correctedBeta = beta < -90 ? 180 : (beta < 0 ? 0 : beta)
        const pitch = pitchArray[Math.floor((correctedBeta/180) * (pitchArray.length - 1))]
        const maxVelocity = 80
        const absoluteVelocity =(accX - triggerThreshold) / maxVelocity
        const adjustedVelocity = absoluteVelocity > 1 ? 1 : absoluteVelocity
        this.synth.triggerAttack(pitch, undefined, adjustedVelocity)
      }
      this.setState({history: refinedHistory.concat([{accX, fire}])})
    })
  }

  render() {
    return (
      <div>
        <h1>gyroSynth</h1>
        <div
          className={'sustain-button' + (this.state.release ? ' on': '')}
          onTouchStart={() => {
            this.setState({release: true})
            this.synth.triggerRelease()
          }}
          onTouchEnd={() => {
            this.setState({release: false})
          }}></div>
      </div>
    );
  }
}

export default App;
