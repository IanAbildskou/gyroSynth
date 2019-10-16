import React, { Component } from 'react'
import GyroNorm from 'gyronorm';
import SaveStats from './SaveStats';

class Synth extends Component {
  constructor(props) {
    super(props)
    const { maxOctave, pitchArray, colorArray } = props.config
    const structuredPitchArray = [...Array(maxOctave).keys()].map((o, octaveIndex) => {
      return pitchArray.map((pitch, pitchIndex) => {
        return { octave: octaveIndex + 1, color: colorArray[pitchIndex], pitch }
      })
    }).flat().reverse()

    this.state = {
      debuggerInfo: {
        alpha: 'No rotation detected',
        beta: 'No rotation detected',
        accX: 'No acceleration detected'
      },
      history: [],
      uninterestinEvents: 0,
      lifted: true,
      structuredPitchArray
    }
  }

  setPitch(pitchMark, pitchAlphaAnchor) {
    const pitch = this.state.structuredPitchArray[pitchMark]
    const color = pitch && pitch.color
    document.getElementsByTagName('BODY')[0].style.backgroundColor = color
    this.setState({pitchMark, pitchAlphaAnchor})
  }

  fire(accX) {
    const { noteDuration, maxVelocity, fireThreshold } = this.props.config
    const { pitchMark, structuredPitchArray, minor } = this.state
    const absoluteVelocity = (accX - fireThreshold) / maxVelocity
    const adjustedVelocity = Math.min(absoluteVelocity, 1)
    this.props.synthCollection.map((synth, index) => {
      const pitchSpan = index === 1 ? (minor ? 3 : 4) : (index === 2 ? 7 : 0)
      const pitchObject = structuredPitchArray[pitchMark + pitchSpan]
      const pitch = pitchObject.pitch + pitchObject.octave
      synth.triggerAttackRelease(pitch, noteDuration, undefined, adjustedVelocity)
      return null
    })
  }

  shouldEngage({event, history}) {
    const { motionFrequency, fireThreshold, fireRecovery } = this.props.config
    const { uninterestinEvents, lifted } = this.state
    const accX = event.dm.gx
    const enoughForceForFire = accX > fireThreshold
    if (enoughForceForFire) {
      const enoughUninterestingEventsHavePassed = fireRecovery < (uninterestinEvents * motionFrequency)
      if (lifted || enoughUninterestingEventsHavePassed) {
        return !!history.length && (accX < history[history.length -1].accX) // is peak
      }
    }
  }

  deviceMotionEvent(event) {
    const { liftedThreshold, debuggerMode, maxHistoryLength, maxHistoryLengthForStats, historyCrunch } = this.props.config
    const oldHistory = this.state.history
    const topHistoryLength = debuggerMode ? maxHistoryLengthForStats : maxHistoryLength
    const history = oldHistory.length > topHistoryLength ? oldHistory.slice(oldHistory.length - historyCrunch) : oldHistory
    const accX = event.dm.gx
    const lift = accX < liftedThreshold
    const fire = this.shouldEngage({event, history})
    const uninterestinEvents = fire ? 0 : (this.state.uninterestinEvents + 1)
    const lifted = fire ? false : lift ? true : this.state.lifted
    this.checkPitch(event)
    fire && this.fire(accX)
    const historyObject = {
      accX,
      fire,
      lifted,
      uninterestinEvents
    }
    this.setState({
      debuggerInfo: {
        alpha: event.do.alpha || 'No rotation detected',
        beta: event.do.beta || 'No rotation detected',
        gamma: event.do.gamma || 'No rotation detected',
        accX: accX || 'No acceleration detected'
      },
      lifted,
      history: history.concat([historyObject]),
      uninterestinEvents
    })
  }

  checkPitch(event) {
    const { pitchShiftDegreeThreshold } = this.props.config
    const { pitchMark, pitchAlphaAnchor, structuredPitchArray } = this.state
    let alpha = event.do.alpha
    const gamma = event.do.gamma
    if (gamma < 0) {
      alpha = (alpha > 180) ? (alpha - 180) : (alpha + 180)
    }
    const difference = alpha - pitchAlphaAnchor
    const absoluteDistance = Math.min(Math.abs(difference), Math.abs(difference + 360), Math.abs(difference - 360))
    const shouldShift = absoluteDistance >= pitchShiftDegreeThreshold
    if (shouldShift) {
      const isCrossingBoundary = Math.abs(difference) > 180
      const pitchUp = isCrossingBoundary ? difference < 0 : difference > 0
      const pitchChange = Math.floor(absoluteDistance / pitchShiftDegreeThreshold) * (pitchUp ? 1 : -1)
      const newMark = pitchMark + pitchChange
      const adjustedNewMark = Math.min(Math.max(newMark, 0), structuredPitchArray.length -1) // can only be between 0 and max pitch
      const newAnchor = pitchAlphaAnchor + (pitchChange * pitchShiftDegreeThreshold)
      const adjustedNewAnchor = (newAnchor > 360) ? newAnchor - 360 : (newAnchor < 0) ? 360 + newAnchor : newAnchor
      this.setPitch(adjustedNewMark, adjustedNewAnchor)
    }
  }

  componentDidMount() {
    const { motionFrequency } = this.props.config
    const { structuredPitchArray } = this.state
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
    const initialPitchMark = Math.floor(structuredPitchArray.length / 2) // The initial pitch mark is just the absolute middle
    this.setPitch(initialPitchMark, 0) // Initial anchor is at 0 degress
    // setInterval(() => this.deviceMotionEvent({dm: {gz: 0, gx: -Math.random() * 60}}), 200)
  }

  render() {
    const { pitchMark, structuredPitchArray, minor, debuggerInfo, history } = this.state
    const { synthCollection, config } = this.props
    const currentPitch = structuredPitchArray[pitchMark] || {}
    return (
      <div className='synth'>
        {(synthCollection.length > 1) && <div
          className={'pedal-button' + (minor ? ' on': '')}
          onTouchStart={() => {
            this.setState({minor: true})
          }}
          onTouchEnd={() => {
            this.setState({minor: false})
          }}>{minor ? 'Minor' : 'Major'}</div>
        }
        {
          config.debuggerMode && <span>
            <SaveStats history={history}/>
            <div className='debugger'>
              <div>Acceleration X: {debuggerInfo.accX}</div>
              <div>Orientation alpha: {debuggerInfo.alpha}</div>
              <div>Orientation beta: {debuggerInfo.beta}</div>
              <div>Orientation gamma: {debuggerInfo.gamma}</div>
            </div>
          </span>
        }
        <div className='pitch-indicator'>{currentPitch.pitch + currentPitch.octave}</div>
      </div>
    )
  }
}

export default Synth
