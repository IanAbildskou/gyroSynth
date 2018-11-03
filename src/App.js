import React, { Component } from 'react';
import './App.css';
import Tone from 'tone';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { alpha: '???', beta: '???', gamma: '???', pitch: 'A1' }
  }

  render() {
    var synth = new Tone.MembraneSynth().toMaster()

    const handleOrientation = event => {
      this.setState({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        pitch: event.beta > 0 ? 'E2' : 'C2'
      })
    }
    window.addEventListener("deviceorientation", handleOrientation, true);

    var loop = new Tone.Loop(function(time){
    	synth.triggerAttackRelease(this.state.pitch, "8n", time)
    }, "4n")

    loop.start(0)
    var onChange = function (e) {
      if (e.target.checked){
        Tone.Transport.start('+0.1')
      } else {
        Tone.Transport.stop()
      }
    };
    return (
      <div className="App">
        <h1>gyroSynth</h1>
        <input type="checkbox" onChange={onChange}></input>
        <div>alpha {this.state.alpha}, </div>
        <div>beta {this.state.beta}, </div>
        <div>gamma {this.state.gamma}, </div>
      </div>
    );
  }
}

export default App;
