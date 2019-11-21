import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import fulltilt from './helpers/fulltilt'; // eslint-disable-line
import isSupportedBrowser from './helpers/isSupportedBrowser';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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

if (isSupportedBrowser()) {
  import('./App')
  .then((App) => {
     render(<MuiThemeProvider theme={theme}><App.default/></MuiThemeProvider>)
  });
} else {
  import('./pages/StartScreen')
  .then((App) => {
     render(<MuiThemeProvider theme={theme}><App.default/></MuiThemeProvider>)
  });
}
