export default ({ leftHanded, monoSynth, polySynth }) => {
  return leftHanded ? polySynth : monoSynth
}
