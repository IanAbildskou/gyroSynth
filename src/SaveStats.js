import React, { Component } from 'react';
import saveAs from 'file-saver';

class SaveStats extends Component {
  render() {
    const save = () => {
      const filteredHistory = this.props.history.filter(o => o.fire)
      var history = JSON.stringify(filteredHistory);
      var array = typeof history !== 'object' ? JSON.parse(history) : history;
      var str = '';
      for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
          if (line !== '') line += ','
          line += array[i][index];
        }
        str += line + '\r\n';
      }

      var blob = new Blob([str], {
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
