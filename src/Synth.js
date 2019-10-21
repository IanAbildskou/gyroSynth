import './Synth.css';
import React, { Component } from 'react'
import GyroNorm from 'gyronorm';
import SaveStats from './SaveStats';

class Synth extends Component {
  constructor(props) {
    super(props)
    const { maxOctave } = props.config.advanced
    const structuredPitchArray = [...Array(maxOctave.value).keys()].map((o, octaveIndex) => {
      return props.pitchArray.map((pitch, pitchIndex) => {
        return { octave: octaveIndex + 1, color: props.colorArray[pitchIndex], pitch }
      })
    }).flat().reverse()

    this.state = {
      debuggerInfo: {
        alpha: 'No rotation detected',
        beta: 'No rotation detected',
        accX: 'No acceleration detected'
      },
      leftHanded: true,
      history: [],
      minor: false,
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

  getPitch() {
    const { pitchMark, structuredPitchArray, minor, leftHanded } = this.state
    let pitch
    const getPitchFromMark = (pitchMark) => {
      const pitchObject = structuredPitchArray[pitchMark]
      return pitchObject.pitch + pitchObject.octave
    }
    if (leftHanded) {
      const pitchArray = [pitchMark, pitchMark + ( minor ? 4 : 3), 7]
      pitch = pitchArray.map(pitchMark => getPitchFromMark(pitchMark))
    } else {
      pitch = getPitchFromMark(pitchMark)
    }
    return pitch
  }

  fire(accX) {
    const { maxVelocity, fireThreshold, tactileFeedbackDuration } = this.props.config.advanced
    const { pressed, leftHanded } = this.state
    const absoluteVelocity = (accX - fireThreshold.value) / maxVelocity.value
    const adjustedVelocity = Math.min(absoluteVelocity, 1)
    window.navigator.vibrate && window.navigator.vibrate(tactileFeedbackDuration.value)
    const synth = leftHanded ? this.props.polySynth : this.props.monoSynth
    if (synth.context.state !== 'running') { // This is most of all for safety. I think also it solved an ios issue where sound would not resume after minimizing
      synth.context.resume();
    }
    const pitch = this.getPitch()
    pressed && this.release()
    synth.triggerAttack(pitch, undefined, adjustedVelocity)
    return null
  }

  shouldEngage({normalizedAccX, history}) {
    const { fireThreshold } = this.props.config.advanced
    const { lifted } = this.state
    const enoughForceForFire = normalizedAccX > fireThreshold.value
    if (enoughForceForFire) {
      if (lifted) {
        return !!history.length && (normalizedAccX < history[history.length -1].normalizedAccX) // is peak
      }
    }
  }

  determineAmbience({event, history}) {
    const { motionFrequency, switchHandAmbienceDuration } = this.props.config.advanced
    const { leftHanded } = this.state
    const accX = event.dm.gx
    const withinRange = value => (value > 2) && (value < 12)
    const checkIfInRange = value => withinRange(value * (leftHanded ? -1 : 1))
    if (checkIfInRange(accX)) {
      const ambienceThreshold = switchHandAmbienceDuration / motionFrequency
      const historySlice = history.slice(history.length - ambienceThreshold, history.length)
      const ambienceArray = historySlice.map(({ accX }) => checkIfInRange(accX))
      const shouldSwitch = !ambienceArray.includes(false)
      if (shouldSwitch) {
        this.setState({ leftHanded: !leftHanded })
      }
    }
  }

  deviceMotionEvent(event) {
    const { config, debuggerMode } = this.props
    const { liftedThreshold, maxHistoryLength, maxHistoryLengthForStats, historyCrunch, releaseTilt } = config.advanced
    const { history, pressed, leftHanded, lifted } = this.state
    const topHistoryLength = debuggerMode ? maxHistoryLengthForStats.value : maxHistoryLength.value
    const historySlice = history.length > topHistoryLength ? history.slice(history.length - historyCrunch.value) : history
    const normalizedBeta = this.getNormalizedBeta(event)
    this.determineAmbience({ event, history: historySlice })
    const isInDangerZone = (normalizedBeta < releaseTilt.value) && (normalizedBeta > -releaseTilt.value)
    const accX = event.dm.gx
    const normalizedAccX = accX * (leftHanded ? 1 : -1)
    const lift = normalizedAccX < liftedThreshold.value
    const gamma = event.do.gamma
    const debuggerInfo = debuggerMode && {
      leftHanded,
      normalizedBeta,
      alpha: event.do.alpha || 'No rotation detected',
      beta: event.do.beta || 'No rotation detected',
      gamma: gamma || 'No rotation detected',
      accX: accX || 'No acceleration detected'
    }
    let fire
    if (isInDangerZone) {
      fire = this.shouldEngage({ normalizedAccX, history: historySlice })
      this.checkPitch(event)
      fire && this.fire(normalizedAccX)
    }
    const historyObject = {
      accX,
      normalizedAccX
    }
    const release = !fire && this.checkLift(event)
    const shouldLift = fire ? false : lift ? true : lifted
    this.setState({
      minor: leftHanded && (gamma > 0),
      debuggerInfo,
      pressed: fire ? true : release ? false : pressed,
      lifted: shouldLift,
      history: historySlice.concat([historyObject])
    })
  }

  release() {
    const { polySynth, monoSynth } = this.props
    const { leftHanded } = this.state
    leftHanded ? polySynth.releaseAll() : monoSynth.triggerRelease()
  }

  getNormalizedBeta(event) {
    const { leftHanded } = this.state
    let beta = event.do.beta
    const gamma = event.do.gamma
    if ((leftHanded && gamma < 0) || (!leftHanded && gamma > 0)) {
      if (beta < 0) {
        beta = -(180 + beta)
      } else {
        beta = 180 - beta
      }
    }
    return beta
  }

  checkLift(event) {
    const { pressed } = this.state
    const { releaseTilt } = this.props.config.advanced
    const releaseTiltAngle = releaseTilt.value
    if (pressed) {
      const beta = this.getNormalizedBeta(event)
      if (beta > releaseTiltAngle) {
        this.release()
        return true
      }
    }
  }

  checkPitch(event) {
    const { value: pitchShiftDegreeThreshold } = this.props.config.simple.pitchShiftDegreeThreshold
    const { pitchMark, pitchAlphaAnchor, structuredPitchArray } = this.state
    let alpha = event.do.alpha
    const gamma = event.do.gamma
    if (gamma < 0) {
      alpha = (alpha > 180) ? (alpha - 180) : (alpha + 180)
    }
    const difference = alpha - pitchAlphaAnchor
    const absoluteDistance = Math.min(Math.abs(difference), Math.abs(difference + 360), Math.abs(difference - 360))
    const shouldShift = absoluteDistance >= (pitchShiftDegreeThreshold / 2)
    if (shouldShift) {
      const isCrossingBoundary = Math.abs(difference) > 180
      const pitchUp = isCrossingBoundary ? difference < 0 : difference > 0
      const pitchChange = Math.floor(absoluteDistance / (pitchShiftDegreeThreshold / 2)) * (pitchUp ? 1 : -1)
      const newMark = pitchMark + pitchChange
      const adjustedNewMark = Math.min(Math.max(newMark, 0), structuredPitchArray.length -1) // can only be between 0 and max pitch
      const newAnchor = pitchAlphaAnchor + (pitchChange * pitchShiftDegreeThreshold)
      const adjustedNewAnchor = (newAnchor > 360) ? newAnchor - 360 : (newAnchor < 0) ? 360 + newAnchor : newAnchor
      this.setPitch(adjustedNewMark, adjustedNewAnchor)
    }
  }

  componentDidMount() {
    const { motionFrequency } = this.props.config.advanced
    const { structuredPitchArray } = this.state
    var gyroNorm = new GyroNorm();
    const gyroNormOptions = {
      frequency: motionFrequency.value,					// ( How often the object sends the values - milliseconds )
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
    // setInterval(() => this.fire(50), 200)
    // this.determineAmbience({event: {dm: {gx: -10}}})
  }

  render() {
    const { pitchMark, structuredPitchArray, debuggerInfo, history, leftHanded, minor } = this.state
    const { debuggerMode } = this.props
    const synth = leftHanded ? this.props.polySynth : this.props.monoSynth
    const currentPitch = structuredPitchArray[pitchMark] || {}
    const pitch = currentPitch.pitch + (minor ? 'm' : '') + currentPitch.octave
    return (
      <div className='synth'>
        <div
          className='main-button attack-toggle'
          onClick={() => synth.triggerAttackRelease(this.getPitch(), 0.5, undefined, 1)}
        >Attack</div>
        {
          debuggerMode && <span>
            <SaveStats history={history}/>
            <div className='debugger'>
              <div>{debuggerInfo.leftHanded ? 'Left hand' : 'Right hand'}</div>
              <div>Normalized beta: {debuggerInfo.normalizedBeta}</div>
              <div>Acceleration X: {debuggerInfo.accX}</div>
              <div>Orientation alpha: {debuggerInfo.alpha}</div>
              <div>Orientation beta: {debuggerInfo.beta}</div>
              <div>Orientation gamma: {debuggerInfo.gamma}</div>
            </div>
          </span>
        }
        <div className='pitch-indicator'>{pitch}</div>
      </div>
    )
  }
}

export default Synth
