import React, { Component } from 'react';

class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false
    }
  }

  render() {
    const { config, changeProp } = this.props
    const { minAttack, maxAttack, minDecay, maxDecay, minSustain, maxSustain, minRelease, maxRelease } = config
    const settingsArray = [
      {prop: 'attack', min: minAttack, max: maxAttack},
      {prop: 'decay', min: minDecay, max: maxDecay},
      {prop: 'sustain', min: minSustain, max: maxSustain},
      {prop: 'release', min: minRelease, max: maxRelease},
    ]
    return (
      <div className={'menu' + (this.state.menuOpen ? ' open' : '')}>
        {
          settingsArray.map(setting => {
            return (
              <div key={setting.prop} className="slidecontainer">
                <div className='setting-name'>{setting.prop}</div>
                <input defaultValue={this.state[setting.prop] * 100} type="range" min={setting.min} max={setting.max} className="slider" id="myRange" onChange={changeProp(setting.prop)}/>
              </div>
            )
          })
        }
        <div className='header' onClick={() => this.setState({menuOpen: !this.state.menuOpen})}>
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
