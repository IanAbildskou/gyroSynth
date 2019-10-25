import './Synth.css';
import React, { Component } from 'react'
import GyroNorm from 'gyronorm';
import SaveStats from './SaveStats';
import getPitch from './synthFunctions/getPitch';
import getSynth from './synthFunctions/getSynth';
import getStructuredPitchArray from './synthFunctions/getStructuredPitchArray';
import deviceMotionEvent from './synthFunctions/deviceMotionEvent';

class Synth extends Component {
  constructor(props) {
    super(props)
    const { pitchArray, colorArray, synthObject } = props
    const { pitchAlphaAnchor, pitchMark } = synthObject
    const structuredPitchArray = getStructuredPitchArray({ pitchArray, colorArray })
    this.state = {
      debuggerInfo: {
        alpha: 'No rotation detected',
        beta: 'No rotation detected',
        accX: 'No acceleration detected'
      },
      leftHanded: true,
      minor: false,
      lifted: true,
      structuredPitchArray,
      pitchMark,
      pitchAlphaAnchor,
      pressed: false
    }
  }

  onMotion({ alpha, beta, gamma, accX, updateState }) {
    const { pitchMark, pitchAlphaAnchor, structuredPitchArray, leftHanded, minor, pressed, lifted } = this.state
    const { debuggerMode, synthObject, config } = this.props
    const { polySynth, monoSynth } = synthObject
    const { tactileFeedbackDuration, maxVelocity, tactileFeedbackPitchDuration, switchHandAmbienceDuration, motionFrequency, maxHistoryLength, liftedThreshold, maxHistoryLengthForStats, historyCrunch, releaseTilt, fireThreshold } = config.advanced
    const { pitchShiftDegreeThreshold } = config.simple
    deviceMotionEvent({
      accX,
      alpha,
      beta,
      gamma,
      liftedThresholdValue: liftedThreshold.value,
      maxHistoryLengthValue: maxHistoryLength.value,
      maxHistoryLengthForStatsValue: maxHistoryLengthForStats.value,
      historyCrunchValue: historyCrunch.value,
      releaseTiltValue: releaseTilt.value,
      debuggerMode,
      pressed,
      leftHanded,
      lifted,
      fireThresholdValue: fireThreshold.value,
      switchHandAmbienceDurationValue: switchHandAmbienceDuration.value,
      motionFrequencyValue: motionFrequency.value,
      tactileFeedbackPitchDurationValue: tactileFeedbackPitchDuration.value,
      pitchShiftDegreeThresholdValue: pitchShiftDegreeThreshold.value,
      structuredPitchArray,
      minor,
      maxVelocityValue: maxVelocity.value,
      tactileFeedbackDurationValue: tactileFeedbackDuration.value,
      polySynth,
      monoSynth,
      pitchMark,
      pitchAlphaAnchor,
      updateState
    });
  }

  componentDidMount() {
    const { motionFrequency } = this.props.config.advanced
    var gyroNorm = new GyroNorm();
    const gyroNormOptions = {
      frequency: motionFrequency.value,		// ( How often the object sends the values - milliseconds )
      gravityNormalized: true,		        // ( If the gravity related values to be normalized )
      orientationBase: GyroNorm.GAME,	   	// ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
      decimalCount: 1,				            // ( How many digits after the decimal point will there be in the return values )
      logger: null,				              	// ( Function to be called to log messages from gyronorm.js )
      screenAdjusted: false		          	// ( If set to true it will return screen adjusted values. )
    }
    const updateState = props => this.setState(props)
    gyroNorm.init(gyroNormOptions).then(() => {
      gyroNorm.start(event => {
        const accX = event.dm.gx
        const { alpha, beta, gamma } = event.do
        this.onMotion({ alpha, beta, gamma, accX, updateState })
      })
    });
  }

  render() {
    const { pitchMark, structuredPitchArray, debuggerInfo, leftHanded, minor } = this.state
    const { debuggerMode, synthObject } = this.props
    const { polySynth, monoSynth } = synthObject
    const synth = getSynth({ leftHanded, monoSynth, polySynth })
    const currentPitch = structuredPitchArray[pitchMark] || {}
    const pitch = currentPitch.pitch + ((minor && leftHanded) ? 'm' : '') + currentPitch.octave
    return (
      <div className='synth'>
        {
          debuggerMode && <span>
            <div
              className='main-button attack-toggle'
              onClick={() => synth.triggerAttackRelease(getPitch({
                pitchMark,
                structuredPitchArray,
                minor,
                leftHanded
              }), 0.5, undefined, 1)}
            >Attack</div>
            <SaveStats/>
            <div className='debugger'>
              {Object.entries(debuggerInfo).map(info => <div key={info[0]}>{info[0] + ': ' + info[1]}</div>)}
            </div>
          </span>
        }
        <div className='pitch-indicator'>{pitch}</div>
      </div>
    )
  }
}

export default Synth
