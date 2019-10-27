export default ({
  normalizedAccX,
  history,
  fireThresholdValue,
  lifted
}) => {
  if (lifted) {
    const enoughForceForFire = normalizedAccX > fireThresholdValue
    if (enoughForceForFire) {
      return !!history.length && (normalizedAccX < history[history.length -1].normalizedAccX) // is peak
    }
  }
}
