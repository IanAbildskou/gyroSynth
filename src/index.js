import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import * as serviceWorker from './serviceWorker';
import fulltilt from './fulltilt'; // eslint-disable-line
import detectChrome from './isChrome';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const config = {
  configurableVariables: {
    advanced: {
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
      maxVelocity: {
        label: 'Max velocity',
        value: 70,
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
        value: 250,
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
      },
      switchHandAmbienceDuration: {
        label: 'How long rest when switching hands',
        value: 50,
        maxValue: 500,
        minValue: 10,
        unit: 'ms',
        description: 'For how long should we wait when switching hands for the ambience to resolve'
      },
      releaseTilt: {
        label: 'Release tilt angle',
        value: 30,
        maxValue: 90,
        minValue: 1,
        unit: '°',
        description: 'At what angle of tilt should the attack release'
      }
    },
    simple: {
      // attack: {
      //   label: 'Attack',
      //   value: 0.01,
      //   maxValue: 10,
      //   minValue: 0.01,
      //   unit: 's',
      //   description: ''
      // },
      // decay: {
      //   label: 'Decay',
      //   value: 1,
      //   maxValue: 10,
      //   minValue: 0.1,
      //   unit: 's',
      //   description: ''
      // },
      // sustain: {
      //   label: 'Sustain',
      //   value: 1,
      //   maxValue: 1,
      //   minValue: 0.01,
      //   description: ''
      // },
      // release: {
      //   label: 'Release',
      //   value: 0.1,
      //   maxValue: 10,
      //   minValue: 0.01,
      //   unit: 's',
      //   description: ''
      // },
      volume: {
        label: 'Volume',
        value: 0,
        maxValue: 150,
        minValue: 0,
        unit: 'dB',
        description: ''
      },
      pitchShiftDegreeThreshold: {
        label: 'Pitch shift degree threshold',
        value: 10,
        maxValue: 100,
        minValue: 1,
        unit: '°',
        description: 'How many degrees does each pitch get to occupy. How pro are you?'
      }
    }
  },
  pitchArray: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  colorArray: ['#d21d1d', '#ff6f61', '#2bc823', '#0fddde', '#1d63ce', '#6a18d4', '#d418a1', '#cddc39', '#ff7f0e', '#acff0e', '#ff8282', '#8b7bc8']
}


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fff'
    },
    secondary: {
      main: '#000'
    }
  }
});

const render = App => ReactDOM.render(App, document.getElementById('root'));

if (detectChrome()) {
  import('./App')
  .then((App) => {
     render(<MuiThemeProvider theme={theme}><App.default config={config}/></MuiThemeProvider>)
  });
} else {
  import('./StartScreen')
  .then((App) => {
     render(<MuiThemeProvider theme={theme}><App.default/></MuiThemeProvider>)
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
