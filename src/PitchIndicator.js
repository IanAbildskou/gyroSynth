import './PitchIndicator.css';
import scroll from './scroll';
import React, { Component } from 'react'
import setPitch from './synthFunctions/setPitch';

const magicNumbers = {
  scrollDuration: 200,
  pitchWidth: 400,
  scrollTimeout: 66,
  fontSize: 150
}

class PitchIndicator extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  getPitchString(pitchObject) {
    const { leftHanded, minor  } = this.props
    return pitchObject.pitch + ((minor && leftHanded) ? 'm' : '') + pitchObject.octave
  }

  componentDidMount() {
    const { pitchWidth } = this.getPitchListProps()
    const { pitchMark  } = this.props
    const initialPosition = pitchMark * pitchWidth
    let scrolling
    this.updateScroll(initialPosition)
    this.getScrollElement().addEventListener('scroll', this.scrollEvent(scrolling).bind(this), false);
  }

  componentDidUpdate(prevProps) {
    const { pitchMark } = this.props
    if (prevProps.pitchMark !== pitchMark) {
      const { pitchWidth } = this.getPitchListProps()
      this.updateScroll(pitchWidth * pitchMark)
    }
  }

  updateScroll(position) {
    scroll({
      element: this.getScrollElement(),
      to: position,
      duration: magicNumbers.scrollDuration,
    })
  }

  scrollEvent(scrolling) {
    return () => {
      const { isTouching } = this.state
        this.setState({ isScrolling: true, position: this.getScrollElement().scrollLeft })
      	window.clearTimeout( scrolling )
      	scrolling = setTimeout(() => {
          this.setState({ isScrolling: false })
      		!isTouching && this.touchEnd(this.props)
      	}, magicNumbers.scrollTimeout);
    }
  }

  getScrollElement() {
    return document.getElementsByClassName('pitch-indicator')[0]
  }

  getPitchListProps() {
    const { structuredPitchArray  } = this.props
    const pitchWidth = magicNumbers.pitchWidth
    const clientWidth = document.documentElement.clientWidth
    const pitchListMargin = (clientWidth - pitchWidth) / 2
    const pitchListWidth = (structuredPitchArray.length * pitchWidth) + (pitchListMargin)
    return { pitchListMargin, pitchListWidth, pitchWidth }
  }

  touchEnd(props) {
    const { structuredPitchArray, tactileFeedbackPitchDurationValue, pitchAlphaAnchor, updatePitch } = this.props
    const currentScrollPosition = this.getScrollElement().scrollLeft
    const { pitchWidth } = this.getPitchListProps()
    const newPitchMark = Math.round(currentScrollPosition / pitchWidth)
    setPitch({
      tactileFeedbackPitchDurationValue,
      pitchMark: newPitchMark,
      pitchAlphaAnchor,
      structuredPitchArray
    })
    updatePitch(newPitchMark)
    const newScrollPosition = newPitchMark * pitchWidth
    this.updateScroll(newScrollPosition)
  }

  render() {
    const { structuredPitchArray, pitchMark } = this.props
    const { isScrolling, position } = this.state
    const { pitchListMargin, pitchListWidth, pitchWidth } = this.getPitchListProps()
    const center = (position || pitchMark) / pitchWidth
    const maxFontSize = magicNumbers.fontSize
    const containerStyles = {
      width: pitchListWidth + 'px',
      marginLeft: pitchListMargin + 'px',
      marginRight: pitchListMargin + 'px'
    }
    return (
      <div
        onTouchStart={() => this.setState({ isTouching: true })}
        onTouchEnd={() => {
          this.setState({ isTouching: false })
          !isScrolling && this.touchEnd(this.props)
        }}
        className='pitch-indicator'
      >
        <div style={containerStyles} className='pitch-list-container'>
          {structuredPitchArray.map((pitchObject, index) => {
            const pitch = this.getPitchString(pitchObject)
            const distanceFromCenter = Math.abs((index - center) * pitchWidth)
            const fontSize = ((Math.max(pitchWidth - distanceFromCenter, 0) / pitchWidth) * maxFontSize)
            const style = {
              width: pitchWidth + 'px',
              fontSize
            }
            return (
              <div
                key={index}
                style={style}
                className='pitch-string-container'
              >{pitch}</div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default PitchIndicator
