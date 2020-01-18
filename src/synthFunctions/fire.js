import vibrate from './vibrate';
import release from './release';

export default ({
  leftHanded,
  pressed,
  maxVelocityValue,
  fireThresholdValue,
  tactileFeedbackDurationValue,
  accX,
  pitch,
  polySynth,
  monoSynth,
  enableDrumMode,
  historySlice,
  rotationVelocityModifierValue
}) => {
  let velocity;
  if (enableDrumMode) {
    velocity = (accX - fireThresholdValue) / maxVelocityValue
  } else {
    const rotation = historySlice[historySlice.length - 6].normalizedBeta - historySlice[historySlice.length - 1].normalizedBeta
    velocity = rotation / rotationVelocityModifierValue
  }
  const adjustedVelocity = Math.min(velocity, 1)
  vibrate({ duration: tactileFeedbackDurationValue })
  const synth = leftHanded ? polySynth : monoSynth
  if (synth.context.state !== 'running') { // This is most of all for safety. I think also it solved an ios issue where sound would not resume after minimizing
    synth.context.resume();
  }
  pressed && release({ polySynth, monoSynth, leftHanded })
  synth.triggerAttack(pitch, undefined, adjustedVelocity)
}
