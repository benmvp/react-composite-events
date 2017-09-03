// @flow
import React from 'react'
import {shallow} from 'enzyme'
import {
  withLongPress,
  withRemainReleased,
  withRemainFocused,
  withRemainBlurred
} from './generic'

const Dummy = () => <div />

jest.useFakeTimers()

describe('`withLongPress`', () => {
  it('calls handler after mouse down & default 1250 ms', () => {
    const EnhancedAnchor = withLongPress()('a')

    let onLongPress = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor href="http://www.benmvp.com/" onLongPress={onLongPress} />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onLongPress).toHaveBeenCalledTimes(0)

    // 1. simulate mouse down
    anchorWrapper.simulate('mousedown')

    // 2. simulate going over time
    jest.runTimersToTime(1250)

    expect(onLongPress).toHaveBeenCalledTimes(1)
  })

  it('calls handler after press in & default 1250 ms', () => {
    const EnhancedDummy = withLongPress()(Dummy)

    let onLongPress = jest.fn()
    let wrapper = shallow(<EnhancedDummy onLongPress={onLongPress} />)
    let dummyWrapper = wrapper.find(Dummy)

    expect(onLongPress).toHaveBeenCalledTimes(0)

    // 1. simulate press in
    dummyWrapper.prop('onPressIn')()

    // 2. simulate going over time
    jest.runTimersToTime(1250)

    expect(onLongPress).toHaveBeenCalledTimes(1)
  })

  it('calls handler after mouse down & specified duration', () => {
    const EnhancedAnchor = withLongPress(450)('a')

    let onLongPress = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onLongPress-450={onLongPress}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onLongPress).toHaveBeenCalledTimes(0)

    // 1. simulate mouse down
    anchorWrapper.simulate('mousedown')

    // 2. simulate going over time
    jest.runTimersToTime(450)

    expect(onLongPress).toHaveBeenCalledTimes(1)
  })

  it('calls handler after press in & specified duration', () => {
    const EnhancedDummy = withLongPress(876)(Dummy)

    let onLongPress = jest.fn()
    let wrapper = shallow(<EnhancedDummy onLongPress-876={onLongPress} />)
    let dummyWrapper = wrapper.find(Dummy)

    expect(onLongPress).toHaveBeenCalledTimes(0)

    // 1. simulate press in
    dummyWrapper.prop('onPressIn')()

    // 2. simulate going over time
    jest.runTimersToTime(876)

    expect(onLongPress).toHaveBeenCalledTimes(1)
  })

  it('does not call handler if mouse up happens before duration expires', () => {
    const EnhancedAnchor = withLongPress()('a')

    let onLongPress = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor href="http://www.benmvp.com/" onLongPress={onLongPress} />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onLongPress).toHaveBeenCalledTimes(0)

    // 1. simulate mouse down
    anchorWrapper.simulate('mousedown')

    // 2. simulate some time passing
    jest.runTimersToTime(450)

    // 3. simulate mouse up
    anchorWrapper.simulate('mouseup')

    // 4. simulate going over time
    jest.runTimersToTime(900)

    expect(onLongPress).toHaveBeenCalledTimes(0)
  })

  it('does not call handler if mouse out happens before duration expires', () => {
    const EnhancedAnchor = withLongPress()('a')

    let onLongPress = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor href="http://www.benmvp.com/" onLongPress={onLongPress} />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onLongPress).toHaveBeenCalledTimes(0)

    // 1. simulate mouse down
    anchorWrapper.simulate('mousedown')

    // 2. simulate some time passing
    jest.runTimersToTime(450)

    // 3. simulate mouse up
    anchorWrapper.simulate('mouseout')

    // 4. simulate going over time
    jest.runTimersToTime(900)

    expect(onLongPress).toHaveBeenCalledTimes(0)
  })

  it('does not call handler if press out happens before duration expires', () => {
    const EnhancedDummy = withLongPress()(Dummy)

    let onLongPress = jest.fn()
    let wrapper = shallow(<EnhancedDummy onLongPress={onLongPress} />)
    let dummyWrapper = wrapper.find(Dummy)

    expect(onLongPress).toHaveBeenCalledTimes(0)

    // 1. simulate press in
    dummyWrapper.prop('onPressIn')()

    // 2. simulate some time passing
    jest.runTimersToTime(450)

    // 3. simulate press out
    dummyWrapper.prop('onPressOut')()

    // 4. simulate going over time
    jest.runTimersToTime(800)

    expect(onLongPress).toHaveBeenCalledTimes(0)
  })
})

describe('`withRemainReleased`', () => {
  it('calls handler after mouse up & default 500 ms', () => {
    const EnhancedAnchor = withRemainReleased()('a')

    let onRemainReleased = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onRemainReleased={onRemainReleased}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onRemainReleased).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseup')

    // 2. simulate going over time
    jest.runTimersToTime(1250)

    expect(onRemainReleased).toHaveBeenCalledTimes(1)
  })

  it('calls handler after press out & default 500 ms', () => {
    const EnhancedDummy = withRemainReleased()(Dummy)

    let onRemainReleased = jest.fn()
    let wrapper = shallow(<EnhancedDummy onRemainReleased={onRemainReleased} />)
    let dummyWrapper = wrapper.find(Dummy)

    expect(onRemainReleased).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    dummyWrapper.prop('onPressOut')()

    // 2. simulate going over time
    jest.runTimersToTime(500)

    expect(onRemainReleased).toHaveBeenCalledTimes(1)
  })

  it('calls handler after mouse up & specified duration', () => {
    const EnhancedAnchor = withRemainReleased(450)('a')

    let onRemainReleased = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onRemainReleased-450={onRemainReleased}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onRemainReleased).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseup')

    // 2. simulate going over time
    jest.runTimersToTime(450)

    expect(onRemainReleased).toHaveBeenCalledTimes(1)
  })

  it('calls handler after press out & specified duration', () => {
    const EnhancedDummy = withRemainReleased(876)(Dummy)

    let onRemainReleased = jest.fn()
    let wrapper = shallow(
      <EnhancedDummy onRemainReleased-876={onRemainReleased} />
    )
    let dummyWrapper = wrapper.find(Dummy)

    expect(onRemainReleased).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    dummyWrapper.prop('onPressOut')()

    // 2. simulate going over time
    jest.runTimersToTime(876)

    expect(onRemainReleased).toHaveBeenCalledTimes(1)
  })

  it('does not call handler if mouse down happens before duration expires', () => {
    const EnhancedAnchor = withRemainReleased()('a')

    let onRemainReleased = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onRemainReleased={onRemainReleased}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onRemainReleased).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseup')

    // 2. simulate some time passing
    jest.runTimersToTime(450)

    // 3. simulate cancel event
    anchorWrapper.simulate('mousedown')

    // 4. simulate going over time
    jest.runTimersToTime(800)

    expect(onRemainReleased).toHaveBeenCalledTimes(0)
  })

  it('does not call handler if press in happens before duration expires', () => {
    const EnhancedDummy = withRemainReleased()(Dummy)

    let onRemainReleased = jest.fn()
    let wrapper = shallow(<EnhancedDummy onRemainReleased={onRemainReleased} />)
    let dummyWrapper = wrapper.find(Dummy)

    expect(onRemainReleased).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    dummyWrapper.prop('onPressOut')()

    // 2. simulate some time passing
    jest.runTimersToTime(450)

    // 3. simulate cancel event
    dummyWrapper.prop('onPressIn')()

    // 4. simulate going over time
    jest.runTimersToTime(800)

    expect(onRemainReleased).toHaveBeenCalledTimes(0)
  })
})

describe('`withRemainFocused`', () => {
  it('calls handler after focus & default 500 ms', () => {
    const EnhancedAnchor = withRemainFocused()('a')

    let onRemainFocused = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onRemainFocused={onRemainFocused}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onRemainFocused).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('focus')

    // 2. simulate going over time
    jest.runTimersToTime(500)

    expect(onRemainFocused).toHaveBeenCalledTimes(1)
  })

  it('calls handler after focus & specified duration', () => {
    const EnhancedDummy = withRemainFocused(876)(Dummy)

    let onRemainFocused = jest.fn()
    let wrapper = shallow(
      <EnhancedDummy onRemainFocused-876={onRemainFocused} />
    )
    let dummyWrapper = wrapper.find(Dummy)

    expect(onRemainFocused).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    dummyWrapper.prop('onFocus')()

    // 2. simulate going over time
    jest.runTimersToTime(876)

    expect(onRemainFocused).toHaveBeenCalledTimes(1)
  })

  it('does not call handler if blur happens before duration expires', () => {
    const EnhancedAnchor = withRemainFocused()('a')

    let onRemainFocused = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onRemainFocused={onRemainFocused}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onRemainFocused).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('focus')

    // 2. simulate some time passing
    jest.runTimersToTime(450)

    // 3. simulate cancel event
    anchorWrapper.simulate('blur')

    // 4. simulate going over time
    jest.runTimersToTime(800)

    expect(onRemainFocused).toHaveBeenCalledTimes(0)
  })
})

describe('`withRemainBlurred`', () => {
  it('calls handler after blur & default 500 ms', () => {
    const EnhancedDummy = withRemainBlurred()(Dummy)

    let onRemainBlurred = jest.fn()
    let wrapper = shallow(<EnhancedDummy onRemainBlurred={onRemainBlurred} />)
    let dummyWrapper = wrapper.find(Dummy)

    expect(onRemainBlurred).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    dummyWrapper.prop('onBlur')()

    // 2. simulate going over time
    jest.runTimersToTime(500)

    expect(onRemainBlurred).toHaveBeenCalledTimes(1)
  })

  it('calls handler after blur & specified duration', () => {
    const EnhancedAnchor = withRemainBlurred(450)('a')

    let onRemainBlurred = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onRemainBlurred-450={onRemainBlurred}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onRemainBlurred).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('blur')

    // 2. simulate going over time
    jest.runTimersToTime(450)

    expect(onRemainBlurred).toHaveBeenCalledTimes(1)
  })

  it('does not call handler if blur happens before duration expires', () => {
    const EnhancedDummy = withRemainBlurred()(Dummy)

    let onRemainBlurred = jest.fn()
    let wrapper = shallow(<EnhancedDummy onRemainBlurred={onRemainBlurred} />)
    let dummyWrapper = wrapper.find(Dummy)

    expect(onRemainBlurred).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    dummyWrapper.prop('onBlur')()

    // 2. simulate some time passing
    jest.runTimersToTime(450)

    // 3. simulate cancel event
    dummyWrapper.prop('onFocus')()

    // 4. simulate going over time
    jest.runTimersToTime(800)

    expect(onRemainBlurred).toHaveBeenCalledTimes(0)
  })
})
