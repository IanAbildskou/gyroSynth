export default ({
  pitchArray,
  colorArray
}) => [...Array(6).keys()].map((o, octaveIndex) => { // 6 is max number of supported octaves
    return pitchArray.map((pitch, pitchIndex) => {
      return { octave: octaveIndex + 1, color: colorArray[pitchIndex], pitch }
    })
  }).flat().reverse()
