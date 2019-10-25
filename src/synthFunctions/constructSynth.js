import Tone from 'tone';
import setPitch from './setPitch';

export default ({
  volumeValue,
  enableReverb,
  structuredPitchArray,
  tactileFeedbackPitchDurationValue
}) => {
  const synthOptions = {
    oscillator: {
      type: 'square',
      modulationIndex: 2,
      modulationType: 'triangle',
      harmonicity: 0.5
    },
    filter : {
      Q: 1,
      type: 'lowpass',
      rolloff: -24
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.4,
      release: 2
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.8,
      release: 1.5,
      baseFrequency: 50,
      octaves: 4,
      exponent: 2
    }
  }
  const synthConstructor = Tone.MonoSynth
  const monoSynth = new synthConstructor(synthOptions)
  const polySynth = new Tone.PolySynth(3, synthConstructor, synthOptions)
  const reverb = new Tone.Freeverb().toMaster();
  if (enableReverb) {
    monoSynth.connect(reverb)
    polySynth.connect(reverb)
  } else {
    monoSynth.toMaster()
    polySynth.toMaster()
  }
  monoSynth.volume.value = volumeValue
  polySynth.volume.value = volumeValue
  const reset = () => {
    monoSynth.dispose()
    polySynth.dispose()
    reverb.dispose()
  }
  const initialPitchMark = Math.floor(structuredPitchArray.length / 2) // The initial pitch mark is just the absolute middle
  const { pitchMark, pitchAlphaAnchor } = setPitch({
    tactileFeedbackPitchDurationValue,
    pitchMark: initialPitchMark,
    pitchAlphaAnchor: 0,
    structuredPitchArray
  }) // Initial anchor is at 0 degress
  return { polySynth, monoSynth, reset, pitchMark, pitchAlphaAnchor }
}
