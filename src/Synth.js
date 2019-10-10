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
    const accX = -(Math.floor(event.dm.gx))
    const enoughForceForFire = accX > fireThreshold
    const fire = enoughForceForFire && this.shouldEngage({accX, history})
    const alpha = event.do.alpha
    const beta = event.do.beta
    this.pitch(event)
    fire && this.fire(accX)
    const historyObject = {
      alpha,
      beta,
      accX,
      fire
    }
    this.setState({
      debugger: {
        beta: beta || 'No rotation detected',
        alpha: alpha || 'No rotation detected',
        accX: accX || 'No acceleration detected'
      },
      history: history.concat([historyObject])
    })
  }

  pitch(event) {
    const { } = this.props.config
    const beta = event.do.beta
    const pitchArray = this.state.pitchArray
    const correctedBeta = beta < -90 ? 180 : (beta < 0 ? 0 : beta)
    const pitchMark = Math.floor((correctedBeta/180) * (pitchArray.length - 1))
    this.setPitch(pitchMark)
  }

  componentDidMount() {
    const { motionFrequency } = this.props.config
    var gn = new GyroNorm();
    gn.init({ frequency: motionFrequency }).then(() => {
      gn.start(event => {
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
            </div>
          </span>
        }
        <div className='pitch-indicator'>{this.state.pitchArray[this.state.pitchMark] + this.state.octaveRange}</div>
      </div>
    )
  }
}

export default Synth
