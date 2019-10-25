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
    const { pitchArray, colorArray } = props
    const structuredPitchArray = getStructuredPitchArray({ pitchArray, colorArray })
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

  componentDidMount() {
    const { pitchMark, pitchAlphaAnchor, structuredPitchArray, history, leftHanded, minor, pressed, lifted } = this.state
    const { debuggerMode, synthObject, config } = this.props
    const { polySynth, monoSynth } = synthObject
    const { tactileFeedbackDuration, maxVelocity, tactileFeedbackPitchDuration, switchHandAmbienceDuration, motionFrequency, maxHistoryLength, liftedThreshold, maxHistoryLengthForStats, historyCrunch, releaseTilt, fireThreshold } = config.advanced
    const { pitchShiftDegreeThreshold } = config.simple
    var gyroNorm = new GyroNorm();
    const gyroNormOptions = {
      frequency: motionFrequency.value,		// ( How often the object sends the values - milliseconds )
      gravityNormalized: true,		        // ( If the gravity related values to be normalized )
      orientationBase: GyroNorm.GAME,	   	// ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
      decimalCount: 1,				            // ( How many digits after the decimal point will there be in the return values )
      logger: null,				              	// ( Function to be called to log messages from gyronorm.js )
      screenAdjusted: false		          	// ( If set to true it will return screen adjusted values. )
    }
    gyroNorm.init(gyroNormOptions).then(() => {
      gyroNorm.start(event => {
        const accX = event.dm.gx
        const { alpha, beta, gamma } = event.do
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
          history,
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
          pitchAlphaAnchor
        });
      })
    });
  }

  render() {
    const { pitchMark, structuredPitchArray, debuggerInfo, history, leftHanded, minor } = this.state
    const { debuggerMode, synthObject } = this.props
    const { polySynth, monoSynth } = synthObject
    const synth = getSynth({ leftHanded, monoSynth, polySynth })
    const currentPitch = structuredPitchArray[pitchMark] || {}
    const pitch = currentPitch.pitch + (minor ? 'm' : '') + currentPitch.octave
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
