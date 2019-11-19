import React, { Component } from 'react';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <p>We're getting no input from your gyroscope or accelerometer.</p>
        <p>Make sure you're using a phone or tablet and that you have given us permissions to use the device gyroscope and accelerometer.</p>
      </div>
    );
  }
}

export default StartScreen;
