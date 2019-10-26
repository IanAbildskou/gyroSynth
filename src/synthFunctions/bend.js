import Tone from 'tone';

export default ({ gamma, pressed, monoSynth, bendRangeValue }) => {
    const correctedTilt = 90 - Math.abs(gamma)
    const frequency = Tone.Frequency(pressed)
    const currentFrequency = frequency.toFrequency()
    const maxBendFrequency = frequency.transpose(bendRangeValue).toFrequency()
    const diff = maxBendFrequency - currentFrequency
    const bend = (correctedTilt * diff) / 100
    const newFrequency = currentFrequency + bend
    monoSynth.frequency.rampTo(newFrequency, 0)
  }
