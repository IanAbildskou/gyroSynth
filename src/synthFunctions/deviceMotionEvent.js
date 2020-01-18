import bend from './bend';
import tremolo from './tremolo';
import checkLift from './checkLift';
import checkPitch from './checkPitch';
// import determineAmbience from './determineAmbience';
import fire from './fire';
import getNormalizedBeta from './getNormalizedBeta';
import getPitch from './getPitch';
import shouldEngage from './shouldEngage';

export default props => {
  const {
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
    minor,
    pitchMark,
    pitchAlphaAnchor,
    updateState,
    enableDrumMode
  } = props
  const history = window.gyroSynthHistory || []
  const topHistoryLength = debuggerMode ? maxHistoryLengthForStatsValue : maxHistoryLengthValue
  const historySlice = history.length > topHistoryLength ? history.slice(history.length - historyCrunchValue) : history
  const normalizedBeta = getNormalizedBeta(props)
  // const shouldSwitchHands = determineAmbience({ history: historySlice, ...props})
  const normalizedAccX = accX * (leftHanded ? 1 : -1)
  const isInDangerZone = (normalizedBeta < releaseTiltValue) && (normalizedBeta > (-1 * releaseTiltValue))
  let shouldFire, pitch, newPitch, lift, release
  if (isInDangerZone) {
    newPitch = checkPitch(props)
    pitch = getPitch(props)
    shouldFire = shouldEngage({
      normalizedBeta,
      normalizedAccX,
      history: historySlice,
      ...props
    })
    if (shouldFire) {
      fire({ ...props, pitch, historySlice })
    } else {
      pressed && !leftHanded && bend(props)
      pressed && leftHanded && tremolo(props)
      lift = enableDrumMode && (normalizedAccX < (-liftedThresholdValue))
    }
  } else {
    release = !shouldFire && checkLift(props)
  }
  const debuggerInfo = debuggerMode && {
    normalizedAccX,
    liftedThresholdValue,
    historyLength: history.length,
    leftHanded,
    normalizedBeta,
    alpha,
    beta,
    gamma,
    accX,
    lifted,
    pitchMark: (newPitch && newPitch.pitchMark) || pitchMark,
    pitchAlphaAnchor
  }
  const historyObject = {
    accX,
    normalizedAccX,
    normalizedBeta
  }
  window.gyroSynthHistory = historySlice.concat([historyObject])
  const shouldToggleLift = shouldFire || (!lifted && (lift || release))
  const shouldToggleMinor = leftHanded && ((minor && (gamma > 0)) || (!minor && (gamma < 0)))
  const shouldUpdateState = shouldToggleMinor || debuggerMode || newPitch || shouldFire || shouldToggleLift // || shouldSwitchHands
  if (shouldUpdateState) {
    updateState({
      minor: shouldToggleMinor ? !minor : minor,
      debuggerInfo,
      pitchAlphaAnchor: newPitch ? newPitch.pitchAlphaAnchor : pitchAlphaAnchor,
      pitchMark: newPitch ? newPitch.pitchMark : pitchMark,
      // leftHanded: shouldSwitchHands ? !leftHanded : leftHanded,
      pressed: shouldFire ? pitch : release ? false : pressed,
      lifted: shouldToggleLift ? !lifted : lifted
    })
  }
}
