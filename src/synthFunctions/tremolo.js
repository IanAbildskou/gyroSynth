export default ({ volumeValue, maxTremoloVolumeValue, gamma, polySynth }) => {
  const correctedTilt = gamma < 0 ? 180 - Math.abs(gamma) : gamma
  const offSet = (correctedTilt - 90) / 90
  const newVolume = volumeValue + (maxTremoloVolumeValue * offSet)
  polySynth.volume.rampTo(newVolume, 0)
}
