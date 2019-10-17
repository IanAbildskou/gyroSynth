import React, { Component } from 'react';

class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false
    }
  }

  renderSection(setting, section) {
    const settingProps = setting[1]
    const settingKey = setting[0]
    return (
      <div key={settingKey} className="slidecontainer">
        <div className='setting-name'>{settingProps.label}</div>
        <input
          defaultValue={settingProps.value * 100}
          type="range"
          min={settingProps.minValue * 100}
          max={settingProps.maxValue * 100}
          className="slider" id="myRange" onChange={this.props.changeProp(settingKey, section)}
        />
      </div>
    )
  }

  render() {
    const { simple, advanced } = this.props.config
    const advancedSettings = Object.entries(advanced)
    const simpleSettings = Object.entries(simple)
    const toggleMenu = () => this.setState({menuOpen: !this.state.menuOpen})
    return (
      <div className={'menu' + (this.state.menuOpen ? ' open' : '')}>
        <div className={'slider-container'}>
          <div className={'close-menu'} onClick={toggleMenu}>Close</div>
          {advancedSettings.map(setting => this.renderSection(setting, 'advanced'))}
          {simpleSettings.map(setting => this.renderSection(setting, 'simple'))}
          <div className={'close-menu'} onClick={toggleMenu}>Close</div>
        </div>
        <div className='header' onClick={toggleMenu}>
          <svg className='arrow' viewBox="0 0 70.71 49.5">
            <polygon points="35.35 21.21 14.14 0 0 14.14 35.35 49.5 70.71 14.14 56.57 0 35.35 21.21"/>
          </svg>
          <h1>gyroSynth</h1>
        </div>
      </div>
    );
  }
}

export default Menu;
