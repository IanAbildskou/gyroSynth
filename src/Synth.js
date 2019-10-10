import React, { Component } from 'react'
import GyroNorm from 'gyronorm';
import SaveStats from './SaveStats';

class Synth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      debugger: {
        alpha: 'No rotation detected',
        beta: 'No rotation detected',
        accX: 'No acceleration detected'
      },
      pitchMark: 1,
      history: [],
      release: false,
      octaveRange: props.config.defaultOctaveRange,
      pitchArray: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      colorArray: ['#d21d1d', '#fffa17', '#2bc823', '#0fddde', '#1d63ce', '#6a18d4', '#d418a1', '#ff7f0e', '#acff0e', '#ff8282', '#8b7bc8', '#cddc39']
    }
  }

  setPitch(pitchMark) {
    if (pitchMark !== this.state.pitchMark) {
      document.getElementsByTagName('BODY')[0].style.backgroundColor = this.state.colorArray[pitchMark]
      this.setState({pitchMark})
    }
  }

  fire(accX) {
    const { noteDuration, maxVelocity, fireThreshold } = this.props.config
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

  shouldEngage({accX, history}) {
    const { firePeakSpacing } = this.props.config
    const isPeak = history.length && (accX < history[history.length -1]['accX'])
    return isPeak && !history.slice(history.length - (firePeakSpacing)).map(o => o.fire).includes(true)
  }

  deviceMotionEvent(event) {
    const { fireThreshold, debuggerMode, maxHistoryLength, maxHistoryLengthForStats, historyCrunch } = this.props.config
    const oldHistory = this.state.history
    const topHistoryLength = debuggerMode ? maxHistoryLengthForStats : maxHistoryLength
    const history = oldHistory.length > topHistoryLength ? oldHistory.slice(oldHistory.length - historyCrunch) : oldHistory
    const accX = event.dm.gx
    const enoughForceForFire = accX > fireThreshold
    const fire = enoughForceForFire && this.shouldEngage({accX, history})
    const alpha = event.do.alpha
    const beta = event.do.beta
    const gamma = event.do.gamma
    this.pitch(event)
    fire && this.fire(accX)
    const historyObject = {
      alpha,
      beta,
      gamma,
      accX,
      fire
    }
    this.setState({
      debugger: {
        alpha: alpha || 'No rotation detected',
        beta: beta || 'No rotation detected',
        gamma: gamma || 'No rotation detected',
        accX: accX || 'No acceleration detected'
      },
      history: history.concat([historyObject])
    })
  }

  pitch(event) {
    const { alternativePitchShift } = this.props.config
    let pitchMark
    const pitchArrayLength = this.state.pitchArray.length
    if (alternativePitchShift) {
      let alpha = 360 - event.do.alpha
      const gamma = event.do.gamma
      if (gamma < 0) {
        alpha = (alpha > 180) ? (alpha - 180) : (alpha + 180)
      }
      pitchMark = Math.floor((alpha/360) * (pitchArrayLength - 1))
    } else {
      const beta = event.do.beta
      const correctedBeta = beta < -90 ? 180 : (beta < 0 ? 0 : beta)
      pitchMark = Math.floor((correctedBeta/180) * (pitchArrayLength - 1))
    }
    this.setPitch(pitchMark)
  }

  componentDidMount() {
    const { motionFrequency } = this.props.config
    var gyroNorm = new GyroNorm();
    const gyroNormOptions = {
      frequency: motionFrequency,					// ( How often the object sends the values - milliseconds )
      gravityNormalized: true,		        // ( If the gravity related values to be normalized )
      orientationBase: GyroNorm.GAME,	   	// ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
      decimalCount: 1,				            // ( How many digits after the decimal point will there be in the return values )
      logger: null,				              	// ( Function to be called to log messages from gyronorm.js )
      screenAdjusted: false		          	// ( If set to true it will return screen adjusted values. )
    }
    gyroNorm.init(gyroNormOptions).then(() => {
      gyroNorm.start(event => {
        this.deviceMotionEvent(event);
      })
    });

    // setInterval(() => this.deviceMotionEvent({dm: {gz: 0, gx: -Math.random() * 60}}), 200)
  }

  render() {
    return (
      <div className='synth'>
        {(this.props.synthCollection.length > 1) && <div
          className={'pedal-button' + (this.state.minor ? ' on': '')}
          onTouchStart={() => {
            this.setState({minor: true})
          }}
          onTouchEnd={() => {
            this.setState({minor: false})
          }}>{this.state.minor ? 'Minor' : 'Major'}</div>
        }
        {
          this.props.config.debuggerMode && <span>
            <SaveStats history={this.state.history}/>
            <div className='debugger'>
              <div>Acceleration X: {this.state.debugger.accX}</div>
              <div>Orientation alpha: {this.state.debugger.alpha}</div>
              <div>Orientation beta: {this.state.debugger.beta}</div>
              <div>Orientation gamma: {this.state.debugger.gamma}</div>
            </div>
          </span>
        }
        <div className='pitch-indicator'>{this.state.pitchArray[this.state.pitchMark] + this.state.octaveRange}</div>
      </div>
    )
  }
}

export default Synth
