import React, { Component } from 'react'

class Synth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pitchMark: 1,
      history: [],
      release: false,
      octaveRange: 3,
      pitchArray: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      colorArray: ['#d21d1d', '#fffa17', '#2bc823', '#0fddde', '#1d63ce', '#6a18d4', '#d418a1', '#ff7f0e', '#acff0e', '#ff8282', '#8b7bc8', '#cddc39']
    }
  }

  componentDidMount() {
    window.addEventListener("deviceorientation", event => {
      const beta = Math.floor(event.beta)
      const pitchArray = this.state.pitchArray
      const correctedBeta = beta < -90 ? 180 : (beta < 0 ? 0 : beta)
      const pitchMark = Math.floor((correctedBeta/180) * (pitchArray.length - 1))
      document.getElementsByTagName('BODY')[0].style.backgroundColor = this.state.colorArray[pitchMark]
      this.setState({pitchMark})
    }, true)

    const shouldEngage = ({accValue, x, history}) => {
      const isPeak = history.length && (accValue < history[history.length -1][x ? 'accX' : 'accZ'])
      return isPeak && !history.slice(history.length - (x ? 5 : 10)).map(o => x ? o.fire : o.shiftOctaveRange).includes(true)
    }

    const getOctaveRange = (accZ, history) => {
      const minOctaveRange = 1
      const maxOctaveRange = 6
      const octaveShiftThreshold = 30
      const enoughForceForOctaveShift = accZ > octaveShiftThreshold || accZ < -octaveShiftThreshold
      const shiftOctave = enoughForceForOctaveShift && shouldEngage({accValue: accZ, x: false, history})
      if (shiftOctave) {
        const newOctaveRange = Math.sign(accZ) + this.state.octaveRange
        return newOctaveRange < minOctaveRange
          ? minOctaveRange
          : newOctaveRange > maxOctaveRange
            ? maxOctaveRange
            : newOctaveRange
      }
    }

    const deviceMotionEvent = event => {
      const oldHistory = this.state.history
      const history = oldHistory.length > 100 ? oldHistory.slice(oldHistory.length - 10) : oldHistory
      const accZ = Math.floor(event.accelerationIncludingGravity.z)
      const newOctaveRange = getOctaveRange(accZ, history)
      const fireThreshold = 15
      const accX = -(Math.floor(event.accelerationIncludingGravity.x))
      const enoughForceForFire = !newOctaveRange && accX > fireThreshold
      const fire = enoughForceForFire && shouldEngage({accValue: accX, x: true, history})
      if (fire) {
        const maxVelocity = 80
        const absoluteVelocity =(accX - fireThreshold) / maxVelocity
        const adjustedVelocity = absoluteVelocity > 1 ? 1 : absoluteVelocity
        this.props.synthCollection.map((synth, index) => {
          const pitchSpan = index === 1 ? (this.state.minor ? 3 : 4) : (index === 2 ? 7 : 0)
          const pitchArray = this.state.pitchArray
          const pitch = pitchArray.concat(pitchArray)[this.state.pitchMark + pitchSpan] + this.state.octaveRange
          synth.triggerAttack(pitch, undefined, adjustedVelocity)
          return null
        })
      }
      const historyObject = {accX, accZ, fire, shiftOctaveRange: !!newOctaveRange}
      this.setState({
        octaveRange: newOctaveRange || this.state.octaveRange,
        history: history.concat([historyObject])
      })
    }

    window.addEventListener('devicemotion', deviceMotionEvent)

    // setInterval(() => deviceMotionEvent({accelerationIncludingGravity: {x: 0, z: Math.random() * 60}}), 200)
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
        <div className='pitch-indicator'>{this.state.pitchArray[this.state.pitchMark] + this.state.octaveRange}</div>
      </div>
    )
  }
}

export default Synth
