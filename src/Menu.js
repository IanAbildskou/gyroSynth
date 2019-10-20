import './Menu.css';
import React, { Component } from 'react';
import { ArrowForward } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false,
      settingPageOpen: false,
      settingKey: undefined,
      settingSection: undefined
    }
  }

  renderSection(setting, section) {
    const settingProps = setting[1]
    const settingKey = setting[0]
    const valueWithUnit = settingProps.value + (settingProps.unit ? ' ' + settingProps.unit : '')
    return (
      <div onClick={() => this.setState({settingKey, settingSection: section, settingPageOpen: true})} key={settingKey} className={"main-button " + section}>
        <div>{settingProps.label + ': ' + valueWithUnit}</div>
      </div>
    )
  }

  renderSettingPage() {
    const { config } = this.props
    const { settingPageOpen, settingKey, settingSection } = this.state
    const { value, unit, label, description, minValue, maxValue } = (settingSection && settingKey && config[settingSection][settingKey]) || {minValue: 0, value: 0, maxValue: 0}
    const valueWithUnit = label && value + (unit ? ' ' + unit : '')
    return (
      <div className={"setting-page " + (settingPageOpen && 'open')}>
        <IconButton color='primary' className={'close-menu'} onClick={() => this.setState({settingPageOpen: false})}>
          <ArrowForward/>
        </IconButton>
        <div className='setting-page-header'>{label}</div>
        <div className='setting-description'>{description}</div>
        <div className='slider-value'>{valueWithUnit}</div>
        <input
          defaultValue={value * 100}
          type="range"
          min={minValue * 100}
          max={maxValue * 100}
          className="slider" id="myRange" onChange={this.props.changeProp(settingKey, settingSection)}
        />
      </div>
    )
  }

  render() {
    const { config, enableReverb, toggleSetting, enableDebug } = this.props
    const { simple, advanced } = config
    const advancedSettings = Object.entries(advanced)
    const simpleSettings = Object.entries(simple)
    const toggleMenu = this.props.toggleMenu
    return (
      <div className={'menu' + (this.props.menuOpen ? ' open' : '')}>
        {this.renderSettingPage()}
        <div className='simple-options'>
          <div className='simple-option-header'>
            <IconButton color='secondary' className={'close-menu'} onClick={toggleMenu}>
              <ArrowForward/>
            </IconButton>
            Options
          </div>
          <div className='main-button reverb-toggle' onClick={toggleSetting('enableReverb')}>Reverb: { enableReverb ? 'ON' : 'OFF'}</div>
          <div className='main-button debug-toggle' onClick={toggleSetting('enableDebug')}>Debugger: { enableDebug ? 'ON' : 'OFF'}</div>
          {simpleSettings.map(setting => this.renderSection(setting, 'simple'))}
        </div>
        <div className='advanced-options'>
          <div className='advanced-option-header'>Advanced options</div>
          {advancedSettings.map(setting => this.renderSection(setting, 'advanced'))}
        </div>
      </div>
    );
  }
}

export default Menu;
