import React, { Component } from 'react'
import GyroNorm from 'gyronorm';
import SaveStats from './SaveStats';

class Synth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      debugger: { accX: 'No motion detected'},
      pitchMark: 1,
      history: [],
      release: false,
      octaveRange: props.config.defaultOctaveRange,
      pitchArray: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      colorArray: ['#d21d1d', '#fffa17', '#2bc823', '#0fddde', '#1d63ce', '#6a18d4', '#d418a1', '#ff7f0e', '#acff0e', '#ff8282', '#8b7bc8', '#cddc39']
    }
  }

  componentDidMount() {
    const { motionFrequency, firePeakSpacing, octaveShiftPeakSpacing, noteDuration, maxVelocity, fireThreshold, debuggerMode, maxHistoryLength, maxHistoryLengthForStats, historyCrunch } = this.props.config
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
      return isPeak && !history.slice(history.length - (x ? firePeakSpacing : octaveShiftPeakSpacing)).map(o => x ? o.fire : o.shiftOctaveRange).includes(true)
    }

    // const getOctaveRange = (accZ, history) => {
    // const { minOctave, maxOctave, octaveShiftThreshold } = this.props.config
    //   const enoughForceForOctaveShift = accZ > octaveShiftThreshold || accZ < -octaveShiftThreshold
    //   const shiftOctave = enoughForceForOctaveShift && shouldEngage({accValue: accZ, x: false, history})
    //   if (shiftOctave) {
    //     const newOctaveRange = Math.sign(accZ) + this.state.octaveRange
    //     return newOctaveRange < minOctave
    //       ? minOctave
    //       : newOctaveRange > maxOctave
    //         ? maxOctave
    //         : newOctaveRange
    //   }
    // }

    const deviceMotionEvent = event => {
      const oldHistory = this.state.history
      const topHistoryLength = debuggerMode ? maxHistoryLengthForStats : maxHistoryLength
      const history = oldHistory.length > topHistoryLength ? oldHistory.slice(oldHistory.length - historyCrunch) : oldHistory
      const accZ = Math.floor(event.dm.gz)
      const newOctaveRange = false // getOctaveRange(accZ, history) disabled octave shift for now. Too buggy
      const accX = -(Math.floor(event.dm.gx))
      const enoughForceForFire = !newOctaveRange && accX > fireThreshold
      const fire = enoughForceForFire && shouldEngage({accValue: accX, x: true, history})
      if (fire) {
        const absoluteVelocity = (accX - fireThreshold) / maxVelocity
        const adjustedVelocity = Math.min(absoluteVelocity, 1)
        this.props.synthCollection.map((synth, index) => {
          const pitchSpan = index === 1 ? (this.state.minor ? 3 : 4) : (index === 2 ? 7 : 0)
          const pitchArray = this.state.pitchArray
          const pitch = pitchArray.concat(pitchArray)[this.state.pitchMark + pitchSpan] + this.state.octaveRange
          synth.triggerAttackRelease(pitch, noteDuration, undefined, adjustedVelocity)
          return null
        })
      }
      const historyObject = {x: event.dm.gx, z: event.dm.gz, accX, accZ, fire, shiftOctaveRange: !!newOctaveRange}
      this.setState({
        debugger: { accX: accX || 'No motion detected' },
        octaveRange: newOctaveRange || this.state.octaveRange,
        history: history.concat([historyObject])
      })
    }

    var gn = new GyroNorm();
    gn.init({ frequency: motionFrequency }).then(() => {
      gn.start(data => {
        deviceMotionEvent(data);
      })
    });

    // setInterval(() => deviceMotionEvent({dm: {gz: 0, gx: -Math.random() * 60}}), 200)
  }

  render() {
    return (
      <div className='synth'>
        { /* <div
          className={'pedal-button' + (this.state.release ? ' on': '')}
          onTouchStart={() => {
            this.setState({release: true})
            this.props.synthCollection.map(synth => synth.triggerRelease())
          }}
          onTouchEnd={() => {
            this.setState({release: false})
          }}>Kill sustain</div> */ }
        {(this.props.synthCollection.length > 1) && <div
          className={'pedal-button' + (this.state.minor ? ' on': '')}
          onTouchStart={() => {
            this.setState({minor: true})
          }}
          onTouchEnd={() => {
            this.setState({minor: false})
          }}>{this.state.minor ? 'Minor' : 'Major'}</div>
        }
        {this.props.config.debuggerMode && <SaveStats history={this.state.history}/>}
        {this.props.config.debuggerMode && <div className='debugger'>Acceleration X: {this.state.debugger.accX}</div>}
        <div className='pitch-indicator'>{this.state.pitchArray[this.state.pitchMark] + this.state.octaveRange}</div>
      </div>
    )
  }
}

export default Synth
