import './Synth.css';
import React, { Component } from 'react';
import SaveStats from '../widgets/SaveStats';
import PitchIndicator from '../widgets/PitchIndicator';
import getPitch from '../synthFunctions/getPitch';
import getSynth from '../synthFunctions/getSynth';
import getStructuredPitchArray from '../synthFunctions/getStructuredPitchArray';
import deviceMotionEvent from '../synthFunctions/deviceMotionEvent';
import getInitialPitchMark from '../synthFunctions/getInitialPitchMark';

class Synth extends Component {
  constructor(props) {
    super(props)
    const { pitchArray, colorArray, synthObject, leftHanded } = props
    const { pitchAlphaAnchor, pitchMark } = synthObject
    const structuredPitchArray = getStructuredPitchArray({ pitchArray, colorArray })
    this.state = {
      debuggerInfo: {
        alpha: 'No rotation detected',
        beta: 'No rotation detected',
        accX: 'No acceleration detected'
      },
      leftHanded,
      minor: false,
      lifted: true,
      structuredPitchArray,
      pitchMark,
      pitchAlphaAnchor,
      pressed: false
    }
  }

  onMotion = ({ alpha, beta, gamma, accX }) => {
    const { pitchMark, pitchAlphaAnchor, structuredPitchArray, leftHanded, minor, pressed, lifted } = this.state
    const { debuggerMode, synthObject, config, gravity, enableDrumMode } = this.props
    const { polySynth, monoSynth } = synthObject
    const { tactileFeedbackDuration, maxVelocity, tactileFeedbackPitchDuration, motionFrequency, maxHistoryLength, liftedThreshold, maxHistoryLengthForStats, historyCrunch, releaseTilt, fireThreshold, attackTilt, rotationVelocityModifier } = config.advanced
    const { pitchShiftDegreeThreshold, bendRange, volume, maxTremoloVolume } = config.simple
    deviceMotionEvent({
      enableDrumMode,
      rotationVelocityModifierValue: rotationVelocityModifier.value,
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
      attackTiltValue: attackTilt.value,
      // switchHandAmbienceDurationValue: switchHandAmbienceDuration.value,
      motionFrequencyValue: motionFrequency.value,
      tactileFeedbackPitchDurationValue: tactileFeedbackPitchDuration.value,
      pitchShiftDegreeThresholdValue: pitchShiftDegreeThreshold.value,
      structuredPitchArray,
      minor,
      maxVelocityValue: maxVelocity.value,
      tactileFeedbackDurationValue: tactileFeedbackDuration.value,
      // distanceFromGravityToToggleHandValue: distanceFromGravityToToggleHand.value,
      polySynth,
      monoSynth,
      pitchMark,
      pitchAlphaAnchor,
      updateState: props => this.setState(props),
      gravity,
      bendRangeValue: bendRange.value,
      volumeValue: volume.value,
      maxTremoloVolumeValue: maxTremoloVolume.value
    });
  }

  radiansToDegrees = (radians) => {
    return Math.round(radians * (180/Math.PI));
  }

  motionEvent = (data) => {
    const parsedData = JSON.parse(data.data)
    const { alpha, beta, gamma } = parsedData.rotation
    const { x: accX } = parsedData.accelerationIncludingGravity
    this.onMotion({
      alpha: this.radiansToDegrees(alpha),
      beta: this.radiansToDegrees(beta),
      gamma: this.radiansToDegrees(gamma),
      accX: Math.round(accX * 10) / 10
    })
  }

  componentDidMount() {
    document.addEventListener("message", this.motionEvent)
    window.addEventListener("message", this.motionEvent)
    // var i = 1;
    // const mimicsMotion = () => {
    //   setTimeout(() => {
    //     this.onMotion({ alpha: -i, beta: 0, gamma: 80, accX: 9.8, updateState })
    //     i++;
    //     if (i < 1000) {
    //       mimicsMotion();
    //     }
    //   }, 50)
    // }
    // mimicsMotion();
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.motionEvent);
    document.removeEventListener("message", this.motionEvent);
  }

  render() {
    const { pitchMark, structuredPitchArray, debuggerInfo, leftHanded, minor, pitchAlphaAnchor } = this.state
    const { debuggerMode, synthObject } = this.props
    const { polySynth, monoSynth } = synthObject
    const synth = getSynth({ leftHanded, monoSynth, polySynth })
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
        <PitchIndicator
          pitchMark={pitchMark}
          minor={minor}
          leftHanded={leftHanded}
          structuredPitchArray={structuredPitchArray}
          updatePitch={pitchMark => this.setState({ pitchMark })}
          pitchAlphaAnchor={pitchAlphaAnchor}
        />
        <div className='hand-indicator' onClick={() => this.setState({
          pitchMark: getInitialPitchMark({ structuredPitchArray }),
          leftHanded: !leftHanded
        })}>
          <div>
            {leftHanded ? 'Left hand / Chords' : 'Right hand / Single notes'}
          </div>
        </div>
        <img className={'hand-shadow ' + (!leftHanded && 'right')} alt='' src='assets/hand.svg'/>
      </div>
    )
  }
}

export default Synth
