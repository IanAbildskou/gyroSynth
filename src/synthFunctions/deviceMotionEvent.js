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
  pitchAlphaAnchor,
  updateState
}) => {
  const history = window.gyroSynthHistory || []
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
  const isInDangerZone = (normalizedBeta < releaseTiltValue) && (normalizedBeta > (-1 * releaseTiltValue))
  const normalizedAccX = accX * (leftHanded ? 1 : -1)
  const lift = normalizedAccX < liftedThresholdValue
  const debuggerInfo = debuggerMode && {
    historyLength: history.length,
    leftHanded,
    normalizedBeta,
    alpha,
    beta,
    gamma,
    accX,
    lifted
  }
  let shouldFire, pitch, newPitch
  if (isInDangerZone) {
    shouldFire = shouldEngage({
      normalizedAccX,
      history: historySlice,
      fireThresholdValue,
      lifted
    })
    newPitch = checkPitch({
      tactileFeedbackPitchDurationValue,
      alpha,
      gamma,
      pitchShiftDegreeThresholdValue,
      pitchMark,
      pitchAlphaAnchor,
      structuredPitchArray
    })
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
  const shouldToggleLift = shouldFire || (!lifted && lift)
  const shouldToggleMinor = leftHanded && ((minor && (gamma > 0)) || (!minor && (gamma < 0)))
  window.gyroSynthHistory = historySlice.concat([historyObject])
  const shouldUpdateState = shouldToggleMinor || debuggerMode || newPitch || shouldSwitchHands || shouldFire || shouldToggleLift
  if (shouldUpdateState) {
    updateState({
      minor: shouldToggleMinor ? !minor : minor,
      debuggerInfo,
      pitchAlphaAnchor: newPitch ? newPitch.pitchAlphaAnchor : pitchAlphaAnchor,
      pitchMark: newPitch ? newPitch.pitchMark : pitchMark,
      leftHanded: shouldSwitchHands ? !leftHanded : leftHanded,
      pressed: shouldFire ? pitch : release ? false : pressed,
      lifted: shouldToggleLift ? !lifted : lifted
    })
  }
}
