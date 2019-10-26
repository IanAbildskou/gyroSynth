export default ({ pitchMark, structuredPitchArray, minor, leftHanded }) => {
  let pitch
  const getPitchFromMark = (pitchMark) => {
    const pitchObject = structuredPitchArray[pitchMark]
    return pitchObject.pitch + pitchObject.octave
  }
  if (leftHanded) {
    const pitchArray = [pitchMark, pitchMark + ( minor ? 3 : 4), pitchMark + 7]
    pitch = pitchArray.map(pitchMark => getPitchFromMark(pitchMark))
  } else {
    pitch = getPitchFromMark(pitchMark)
  }
  return pitch
}
