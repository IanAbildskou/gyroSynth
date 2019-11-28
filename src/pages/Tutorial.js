import React, { Component } from 'react';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStepIndex: 0,
      steps: [
        {
          title: 'Welcome to GyroSynth!',
          description: <div><p>GyroSynth is a synth controller for your phone.</p><p>You can play single notes and chords by hitting the empty air in front of you with your phone.</p></div>,
          next: 'Show me the basics!'
        },
        {
          title: 'Turn up the volume!',
          description: <div><p>Make sure the volume on yout phone is cranked UP!</p></div>,
          next: 'done!',
          image: 'volume'
        },
        {
          title: 'Which hand do you prefer?',
          description: <div><p>You can play chords with the left hand and single notes with the right hand.</p><p>You can switch between the two at any time</p></div>,
          options: true,
          image: 'choose-hand'
        },
        {
          title: 'Attack',
          description: <div><p>Hold your phone like a drumstick and hit the empty air in front of you to produce sound.</p></div>,
          image: 'arm',
          next: 'Got it!'
        },
        {
          title: 'Change pitch',
          description: <div><p>Rotate around yourself to change pitch.</p></div>,
          next: 'Understood!',
          image: 'pitch-shift'
        },
        {
          title: 'Bend',
          description: <div><p>During the sustain of single note you can tilt the phone to the sides to bend the note.</p></div>,
          next: 'Roger!',
          image: 'bend'
        },
        {
          title: 'Volume sweep',
          description: <div><p>During the sustain of a chord you can tilt the phone to the sides to increase or decrease the volume.</p></div>,
          next: 'Cool!',
          image: 'volume-sweep'
        },
        {
          title: 'Be careful of your surroundings!',
          description: <div><p>Try not to break anything while you're playing.</p></div>,
          next: "Ok, training's over!",
          image: 'careful'
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
    const selectHand = bool => () => {
      this.props.setLeftHanded(bool)
      this.props.launchSynth()
    }
    return (
      <div className='start-screen-container'>
        <h1>{currentStep.title}</h1>
        {currentStep.description}
        {currentStep.image && <img alt='' className={currentStep.image + '-svg'} src={"assets/" + currentStep.image + ".svg"}/>}
        {!lastPage && <div className="skip-button" onClick={() => {
          this.props.close()
          this.props.launchSynth()
        }}>Skip</div>}
        {currentStep.options
          ? <div className='pick-hand-buttons main-button' onClick={onClick}>
            <div onClick={selectHand(true)}>Left</div>
            <div onClick={selectHand(false)}>Right</div>
          </div>
          : <div className='start-button main-button' onClick={onClick}>{currentStep.next}</div>}
      </div>
    );
  }
}

export default StartScreen;
