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
  monoSynth
}) => {
  const absoluteVelocity = (accX - fireThresholdValue) / maxVelocityValue
  const adjustedVelocity = Math.min(absoluteVelocity, 1)
  vibrate({ duration: tactileFeedbackDurationValue })
  const synth = leftHanded ? polySynth : monoSynth
  if (synth.context.state !== 'running') { // This is most of all for safety. I think also it solved an ios issue where sound would not resume after minimizing
    synth.context.resume();
  }
  pressed && release({ polySynth, monoSynth, leftHanded })
  synth.triggerAttack(pitch, undefined, adjustedVelocity)
}
