export default ({
  accX,
  history,
  switchHandAmbienceDurationValue,
  distanceFromGravityToToggleHandValue,
  motionFrequencyValue,
  gravity,
  leftHanded
}) => {
  const withinRange = value => (value > (gravity - distanceFromGravityToToggleHandValue)) && (value < gravity + distanceFromGravityToToggleHandValue)
  const checkIfInRange = value => withinRange(value * (leftHanded ? -1 : 1))
  if (checkIfInRange(accX)) {
    const ambienceThreshold = switchHandAmbienceDurationValue / motionFrequencyValue
    const historySlice = history.slice(history.length - ambienceThreshold, history.length)
    const ambienceArray = historySlice.map(({ accX }) => checkIfInRange(accX))
    const shouldSwitch = !ambienceArray.includes(false)
    if (shouldSwitch) {
      return true
    }
  }
}
