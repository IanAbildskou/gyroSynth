import React, { Component } from 'react';

class Synth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      beta: undefined,
      history: [],
      release: false
    }
  }

  componentDidMount() {
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
        const pitchMark = Math.floor((correctedBeta/180) * (pitchArray.length - 1))
        const maxVelocity = 80
        const absoluteVelocity =(accX - triggerThreshold) / maxVelocity
        const adjustedVelocity = absoluteVelocity > 1 ? 1 : absoluteVelocity
        this.props.synthCollection.map((synth, index) => {
          const pitchSpan = index === 1 ? (this.state.minor ? 3 : 4) : (index === 2 ? 7 : 0)
          const pitch = pitchArray.concat(pitchArray)[pitchMark + pitchSpan]
          synth.triggerAttack(pitch, undefined, adjustedVelocity)
          return null
        })
      }
      this.setState({history: refinedHistory.concat([{accX, fire}])})
    })
    // const pitchArray = ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3']
    // const fire = () => this.props.synthCollection.map((synth, index) => {
    //   const pitchSpan = index === 1 ? (this.state.minor ? 3 : 4) : (index === 2 ? 7 : 0)
    //   const pitchMark = 0
    //   const pitch = pitchArray.concat(pitchArray)[pitchMark + pitchSpan]
    //   synth.triggerAttack(pitch, undefined, 1)
    //   return null
    // })
    // setInterval(fire, 1000)
  }

  render() {
    return (
      <div className='synth'>
        <div
          className={'pedal-button' + (this.state.release ? ' on': '')}
          onTouchStart={() => {
            this.setState({release: true})
            this.props.synthCollection.map(synth => synth.triggerRelease())
          }}
          onTouchEnd={() => {
            this.setState({release: false})
          }}>Kill sustain</div>
        {(this.props.synthCollection.length > 1) && <div
          className={'pedal-button' + (this.state.minor ? ' on': '')}
          onTouchStart={() => {
            this.setState({minor: true})
          }}
          onTouchEnd={() => {
            this.setState({minor: false})
          }}>{this.state.minor ? 'Minor' : 'Major'}</div>
        }
      </div>
    );
  }
}

export default Synth;
