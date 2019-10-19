import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import * as serviceWorker from './serviceWorker';
import fulltilt from './fulltilt'; // eslint-disable-line
import detectChrome from './isChrome';

const config = {
  configurableVariables: {
    advanced: {
      maxOctave: {
        label: 'Available octaves',
        value: 6,
        maxValue: 10,
        minValue: 1,
        description: 'How many octaves should be available to shift through',
      },
      fireThreshold: {
        label: 'Trigger attack threshold',
        value: 15,
        maxValue: 50,
        minValue: 1,
        unit: 'm/s²',
        description: 'What is the acceleration threshold for triggering an attack'
      },
      liftedThreshold: {
        label: 'Lifted threshold',
        value: 5,
        maxValue: 40,
        minValue: 1,
        unit: 'm/s²',
        description: 'What is the acceleration threshold for triggering a lift'
      },
      fireRecovery: {
        label: 'Auto lift timeout',
        value: 1000,
        maxValue: 3000,
        minValue: 0,
        unit: 'ms',
        description: 'Time before another attack can occur without lift'
      },
      maxVelocity: {
        label: 'Max velocity',
        value: 50,
        maxValue: 100,
        minValue: 0,
        unit: 'm/s²',
        description: 'What is the minimum acceleration to trigger maximum velocity'
      },
      motionFrequency: {
        label: 'Motion frequency',
        value: 5,
        maxValue: 100,
        minValue: 1,
        unit: 'ms/detection',
        description: 'What is the resolution for motion detection (ms/detection)'
      },
      maxHistoryLength: {
        label: 'Max history length',
        value: 50,
        maxValue: 100,
        minValue: 1,
        description: 'How many entries of history do we want to keep around for peak detection for trigger attack. Less history means better performance but worse peak detection'
      },
      maxHistoryLengthForStats: {
        label: 'Max history length for stats',
        value: 10000,
        maxValue: 1000000,
        minValue: 1,
        description: 'This is history max length for when advanced mode is enabled. Good for exporting stats to analyse. We want to have a lot of history to export when debugging'
      },
      historyCrunch: {
        label: 'History crunch',
        value: 10,
        maxValue: 100,
        minValue: 1,
        description: 'How many history entries do we want to scrape off per slice. This is a performance parameter.'
      },
      tactileFeedbackDuration: {
        label: 'Tactile feedback duration',
        value: 50,
        maxValue: 1000,
        minValue: 1,
        unit: 'ms',
        description: 'For how long should the phone vibrate when an attack is triggered.'
      }
    },
    simple: {
      noteDuration: {
        label: 'Note duration',
        value: 0.5,
        maxValue: 10,
        minValue: 0.01,
        unit: 's',
        description: 'What is the duration of a note'
      },
      attack: {
        label: 'Attack',
        value: 0.01,
        maxValue: 10,
        minValue: 0.01,
        unit: 's',
        description: ''
      },
      decay: {
        label: 'Decay',
        value: 1,
        maxValue: 10,
        minValue: 0.1,
        unit: 's',
        description: ''
      },
      sustain: {
        label: 'Sustain',
        value: 0.01,
        maxValue: 1,
        minValue: 0.01,
        description: ''
      },
      release: {
        label: 'Release',
        value: 0.1,
        maxValue: 10,
        minValue: 0.01,
        unit: 's',
        description: ''
      },
      volume: {
        label: 'Volume',
        value: 20,
        maxValue: 50,
        minValue: 0,
        unit: 'dB',
        description: ''
      },
      pitchShiftDegreeThreshold: {
        label: 'Pitch shift degree threshold',
        value: 20,
        maxValue: 100,
        minValue: 1,
        unit: '°',
        description: 'How many degrees does each pitch get to occupy. How pro are you?'
      }
    }
  },
  debuggerMode: false, // Show more tools for debugging and calibration
  pitchArray: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  colorArray: ['#d21d1d', '#fffa17', '#2bc823', '#0fddde', '#1d63ce', '#6a18d4', '#d418a1', '#cddc39', '#ff7f0e', '#acff0e', '#ff8282', '#8b7bc8']
}

const render = App => ReactDOM.render(App, document.getElementById('root'));

if (detectChrome()) {
  import('./App')
  .then((App) => {
     render(<App.default config={config}/>)
  });
} else {
  import('./StartScreen')
  .then((App) => {
     render(<App.default/>)
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
