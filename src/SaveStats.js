import React, { Component } from 'react';
import saveAs from 'file-saver';

class SaveStats extends Component {
  render() {
    const save = () => {
      const history = this.props.history
      const keys = Object.keys(history[0])
      var exportedData = ''
      keys.map((key, index) => {
        const isEnd = (index + 1) === keys.length
        exportedData += (key + (isEnd ? '\r\n' : ','))
        return null
      })
      history.map(o => {
        keys.map((key, index) => {
          const isEnd = (index + 1) === keys.length
          exportedData += (o[key] + (isEnd ? '\r\n' : ','))
          return null
        })
        return null
      })
      var blob = new Blob([exportedData], {
        type: "text/plain;charset=utf-8;",
      });
      saveAs(blob, "stats-history.txt");
    }

    return (
      <div className="save-stats">
        <button onClick={save}>save stats</button>
      </div>
    );
  }
}

export default SaveStats;
