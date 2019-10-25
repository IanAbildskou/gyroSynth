import release from './release';
import getNormalizedBeta from './getNormalizedBeta';

export default ({
  polySynth,
  monoSynth,
  pressed,
  releaseTiltValue,
  beta,
  gamma,
  leftHanded
}) => {
  if (pressed) {
    const normalizedBeta = getNormalizedBeta({ beta, gamma, leftHanded })
    if (normalizedBeta > releaseTiltValue) {
      release({ polySynth, monoSynth, leftHanded })
      return true
    }
  }
}
