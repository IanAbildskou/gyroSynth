import bend from './bend';
import checkLift from './checkLift';
import checkPitch from './checkPitch';
import determineAmbience from './determineAmbience';
import fire from './fire';
import getNormalizedBeta from './getNormalizedBeta';
import getPitch from './getPitch';
import shouldEngage from './shouldEngage';

  export default ({
    liftedThresholdValue,
    maxHistoryLengthValue,
    maxHistoryLengthForStatsValue,
    historyCrunchValue,
    releaseTiltValue,
    debuggerMode,
    history,
    pressed,
    leftHanded,
    lifted,
    beta,
    alpha,
    gamma,
    accX,
    fireThresholdValue,
    switchHandAmbienceDurationValue,
    motionFrequencyValue,
    tactileFeedbackPitchDurationValue,
    pitchShiftDegreeThresholdValue,
    structuredPitchArray,
    minor,
    maxVelocityValue,
    tactileFeedbackDurationValue,
    polySynth,
    monoSynth,
    pitchMark,
    pitchAlphaAnchor
  }) => {
    const topHistoryLength = debuggerMode ? maxHistoryLengthForStatsValue : maxHistoryLengthValue
    const historySlice = history.length > topHistoryLength ? history.slice(history.length - historyCrunchValue) : history
    const normalizedBeta = getNormalizedBeta({
      beta,
      gamma,
      leftHanded
    })
    const shouldSwitchHands = determineAmbience({
      accX,
      history: historySlice,
      switchHandAmbienceDurationValue,
      motionFrequencyValue,
      leftHanded
    })
    const isInDangerZone = (normalizedBeta < releaseTiltValue) && (normalizedBeta > -releaseTiltValue)
    const normalizedAccX = accX * (leftHanded ? 1 : -1)
    const lift = normalizedAccX < liftedThresholdValue
    const debuggerInfo = debuggerMode && {
      leftHanded,
      normalizedBeta,
      alpha: alpha || 'No rotation detected',
      beta: beta || 'No rotation detected',
      gamma: gamma || 'No rotation detected',
      accX: accX || 'No acceleration detected'
    }
    let shouldFire, pitch, newPitchAlphaAnchor, newPitchMark
    if (isInDangerZone) {
      shouldFire = shouldEngage({
        normalizedAccX,
        history: historySlice,
        fireThresholdValue,
        lifted
      })
      const newPitch = checkPitch({
        tactileFeedbackPitchDurationValue,
        alpha,
        gamma,
        pitchShiftDegreeThresholdValue,
        pitchMark,
        pitchAlphaAnchor,
        structuredPitchArray
      })
      newPitchAlphaAnchor = newPitch.pitchAlphaAnchor
      newPitchMark = newPitch.pitchMark
      pitch = getPitch({
        pitchMark,
        structuredPitchArray,
        minor,
        leftHanded
      })
      shouldFire && fire({
        leftHanded,
        pressed,
        maxVelocityValue,
        fireThresholdValue,
        tactileFeedbackDurationValue,
        accX,
        pitch,
        polySynth,
        monoSynth
      })
      !shouldFire && pressed && !leftHanded && bend({
        gamma,
        pressed,
        monoSynth
      })
    }
    const historyObject = {
      accX,
      normalizedAccX
    }
    const release = !shouldFire && checkLift({
      polySynth,
      monoSynth,
      pressed,
      releaseTiltValue,
      beta,
      gamma,
      leftHanded
    })
    const shouldLift = shouldFire ? false : lift ? true : lifted
    this.setState({
      minor: leftHanded && (gamma > 0),
      debuggerInfo,
      pitchAlphaAnchor: newPitchAlphaAnchor || pitchAlphaAnchor,
      pitchMark: newPitchMark || pitchMark,
      leftHanded: shouldSwitchHands ? !leftHanded : leftHanded,
      pressed: shouldFire ? pitch : release ? false : pressed,
      lifted: shouldLift,
      history: historySlice.concat([historyObject])
    })
  }
