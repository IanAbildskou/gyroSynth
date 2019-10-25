export default ({
  normalizedAccX,
  history,
  fireThresholdValue,
  lifted
}) => {
  const enoughForceForFire = normalizedAccX > fireThresholdValue
  if (enoughForceForFire) {
    if (lifted) {
      return !!history.length && (normalizedAccX < history[history.length -1].normalizedAccX) // is peak
    }
  }
}
