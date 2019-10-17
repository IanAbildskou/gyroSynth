import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import fulltilt from './fulltilt'; // eslint-disable-line

const config = {
  maxOctave: 6, // What's the minimum octave
  fireThreshold: 15, // What's the acceleration threshols for triggering an attack
  liftedThreshold: 5, // What's the acceleration threshols for triggering a lift
  fireRecovery: 1000, // ms for another fire to occur without lift
  maxVelocity: 50, // What's the minimum acceleration to trigger maximum velocity
  noteDuration: 0.5, // What's the duration of a note (ms or annotation)
  motionFrequency: 5, // What's the resolution for motion detection (ms)
  defaultAttack: 0.01,
  minAttack: 1,
  maxAttack: 80,
  defaultDecay: 1,
  minDecay: 10,
  maxDecay: 1000,
  defaultSustain: 0.01,
  minSustain: 1,
  maxSustain: 100,
  defaultRelease: 0.1,
  minRelease: 10,
  maxRelease: 100,
  defaultVolume: 20,
  maxHistoryLength: 50, // How much history do we want to keep around
  maxHistoryLengthForStats: 10000, // We want to have a lot of history to export when debugging
  debuggerMode: true, // Show more tools for debugging and calibration
  historyCrunch: 10, // How many entries do we want to scrape off per slice. This is a performance question
  pitchShiftDegreeThreshold: 20,
  pitchArray: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  colorArray: ['#d21d1d', '#fffa17', '#2bc823', '#0fddde', '#1d63ce', '#6a18d4', '#d418a1', '#ff7f0e', '#acff0e', '#ff8282', '#8b7bc8', '#cddc39']
}

ReactDOM.render(<App config={config} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
