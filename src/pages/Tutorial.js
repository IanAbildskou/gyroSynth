import React, { Component } from 'react';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStepIndex: 0,
      steps: [
        {
          title: 'Welcome to GyroSynth!',
          description: <div><p>GyroSynth is a synth controller for your phone.</p><p>You can play single notes and chords by hitting the empty air in front of you with your phone.</p></div>
        },
        {
          title: 'Attack',
          description: <div><p>Hold your phone like a drumstick and hit the empty air in front of you to produce sound.</p><p>Rotate around yourself to change pitch.</p></div>,
          image: 'arm'
        },
      ]
    }
  }

  render() {
    const { currentStepIndex, steps } = this.state;
    const currentStep = steps[currentStepIndex];
    const lastPage = currentStepIndex === (steps.length - 1)
    const onClick = lastPage
      ? this.props.close
      : () => this.setState({ currentStepIndex: currentStepIndex + 1 })
    return (
        <div className='start-screen-container'>
        <h1>{currentStep.title}</h1>
        {currentStep.description}
        {currentStep.image && <img alt='' className='arm-svg' src={"assets/" + currentStep.image + ".svg"}/>}
        {!lastPage && <div className="skip-button" onClick={this.props.close}>Skip</div>}
        <div className='start-button main-button' onClick={onClick}>Got it! -></div>
      </div>
    );
  }
}

export default StartScreen;
