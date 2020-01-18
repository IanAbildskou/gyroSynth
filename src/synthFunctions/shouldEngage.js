export default ({
  normalizedAccX,
  history,
  fireThresholdValue,
  lifted,
  enableDrumMode,
  normalizedBeta,
  attackTiltValue
}) => {
  if (lifted) {
    if (enableDrumMode) {
      const enoughForceForFire = normalizedAccX > fireThresholdValue
      if (enoughForceForFire) {
        return !!history.length && (normalizedAccX < history[history.length -1].normalizedAccX) // is peak
      }
    } else {
      const underFireThreshold = normalizedBeta < attackTiltValue
      return underFireThreshold
    }
  }
}
