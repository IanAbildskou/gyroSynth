export default ({ beta, gamma, leftHanded }) => {
  let normalizedBeta = beta
  if ((leftHanded && gamma < 0) || (!leftHanded && gamma > 0)) {
    if (normalizedBeta < 0) {
      normalizedBeta = -(180 + normalizedBeta)
    } else {
      normalizedBeta = 180 - normalizedBeta
    }
  }
  return normalizedBeta
}
