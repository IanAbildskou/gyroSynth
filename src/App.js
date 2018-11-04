import React, { Component } from 'react';
import './App.css';
import Synth from './Synth';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <h1>gyroSynth</h1>
        <Synth></Synth>
      </div>
    );
  }
}

export default App;
