export default ({ polySynth, monoSynth, leftHanded }) => {
  leftHanded ? polySynth.releaseAll() : monoSynth.triggerRelease()
}
