import setPitch from './setPitch';

export default ({
  tactileFeedbackPitchDurationValue,
  alpha,
  gamma,
  pitchShiftDegreeThresholdValue,
  pitchMark,
  pitchAlphaAnchor,
  structuredPitchArray
}) => {
  let normalizedAlpha = alpha
  if (gamma < 0) {
    normalizedAlpha = (normalizedAlpha > 180) ? (normalizedAlpha - 180) : (normalizedAlpha + 180)
  }
  const difference = normalizedAlpha - pitchAlphaAnchor
  const absoluteDistance = Math.min(Math.abs(difference), Math.abs(difference + 360), Math.abs(difference - 360))
  const shouldShift = absoluteDistance >= (pitchShiftDegreeThresholdValue / 2)
  if (shouldShift) {
    const isCrossingBoundary = Math.abs(difference) > 180
    const pitchUp = isCrossingBoundary ? difference < 0 : difference > 0
    const pitchChange = Math.floor(absoluteDistance / (pitchShiftDegreeThresholdValue / 2)) * (pitchUp ? 1 : -1)
    const newMark = pitchMark + pitchChange
    const adjustedNewMark = Math.min(Math.max(newMark, 0), structuredPitchArray.length -1) // can only be between 0 and max pitch
    const newAnchor = pitchAlphaAnchor + (pitchChange * pitchShiftDegreeThresholdValue)
    const adjustedNewAnchor = (newAnchor > 360) ? newAnchor - 360 : (newAnchor < 0) ? 360 + newAnchor : newAnchor
    return setPitch({
      tactileFeedbackPitchDurationValue,
      pitchMark: adjustedNewMark,
      pitchAlphaAnchor: adjustedNewAnchor,
      structuredPitchArray
    })
  }
}
