import React, { Component } from 'react';
import { ArrowForward } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

class SettingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.settingKey !== this.props.settingKey) {
      this.setState({ value: this.props.value })
    }
  }

  render() {
    const value = this.state.value
    const { settingPageOpen, settingKey, settingSection, debouncedFunction, closeSettingPage, config } = this.props
    const { unit, label, description, minValue, maxValue } = (settingSection && settingKey && config[settingSection][settingKey]) || {minValue: 0, value: 0, maxValue: 0}
    const valueWithUnit = label && value + (unit ? ' ' + unit : '')
    const change = (e) => {
      const value = Math.floor(e.target.value / 100)
      this.setState({ value })
      debouncedFunction(value)
    }
    return (
      <div className={"setting-page " + (settingPageOpen && 'open')}>
        <IconButton color='primary' className={'close-menu'} onClick={closeSettingPage}>
          <ArrowForward/>
        </IconButton>
        <div className='setting-page-header'>{label}</div>
        <div className='setting-description'>{description}</div>
        <div className='slider-value'>{valueWithUnit}</div>
        <input
          value={value * 100}
          type="range"
          min={minValue * 100}
          max={maxValue * 100}
          className="slider" id="myRange" onChange={change}
        />
      </div>
    )
  }
}

export default SettingPage;
