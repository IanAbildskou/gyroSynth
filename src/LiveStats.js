import React, { Component } from 'react';

class LiveStats extends Component {
  render() {
    const {pitch, alpha, beta, gamma} = this.props.stats
    return (
      <div className="live-stats">
        <div>pitch {pitch}, </div>
        <div>alpha {alpha}, </div>
        <div>beta {beta}, </div>
        <div>gamma {gamma}, </div>
      </div>
    );
  }
}

export default LiveStats;
