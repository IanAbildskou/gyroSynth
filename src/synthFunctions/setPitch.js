import vibrate from './vibrate';

export default ({
  tactileFeedbackPitchDurationValue,
  pitchMark,
  pitchAlphaAnchor,
  structuredPitchArray
}) => {
  const pitch = structuredPitchArray[pitchMark]
  const color = pitch && pitch.color
  document.getElementsByTagName('BODY')[0].style.backgroundColor = color
  vibrate({ duration: tactileFeedbackPitchDurationValue })
  return ({ pitchMark, pitchAlphaAnchor })
}
