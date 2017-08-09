import React from 'react'
import {shallow} from 'enzyme'
import {withKeyRemainDown, withKeyRemainUp} from './key'

const Dummy = () => <div />

jest.useFakeTimers()

describe('`withKeyRemainDown`', () => {
  it('calls handler after key down & default 500 ms', () => {
    const EnhancedAnchor = withKeyRemainDown()('a')

    let onKeyRemainDown = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onKeyRemainDown={onKeyRemainDown}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onKeyRemainDown).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('keydown')

    // 2. simulate going over time
    jest.runTimersToTime(500)

    expect(onKeyRemainDown).toHaveBeenCalledTimes(1)
  })

  it('calls handler after key down & specified duration', () => {
    const EnhancedDummy = withKeyRemainDown(876)(Dummy)

    let onKeyRemainDown = jest.fn()
    let wrapper = shallow(
      <EnhancedDummy onKeyRemainDown-876={onKeyRemainDown} />
    )
    let dummyWrapper = wrapper.find(Dummy)

    expect(onKeyRemainDown).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    dummyWrapper.prop('onKeyDown')()

    // 2. simulate going over time
    jest.runTimersToTime(876)

    expect(onKeyRemainDown).toHaveBeenCalledTimes(1)
  })

  it('does not call handler if key up happens before duration expires', () => {
    const EnhancedAnchor = withKeyRemainDown()('a')

    let onKeyRemainDown = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onKeyRemainDown={onKeyRemainDown}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onKeyRemainDown).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('keydown')

    // 2. simulate some time passing
    jest.runTimersToTime(450)

    // 3. simulate cancel event
    anchorWrapper.simulate('keyup')

    // 4. simulate going over time
    jest.runTimersToTime(800)

    expect(onKeyRemainDown).toHaveBeenCalledTimes(0)
  })
})

describe('`withKeyRemainUp`', () => {
  it('calls handler after key up & default 500 ms', () => {
    const EnhancedDummy = withKeyRemainUp()(Dummy)

    let onKeyRemainUp = jest.fn()
    let wrapper = shallow(<EnhancedDummy onKeyRemainUp={onKeyRemainUp} />)
    let dummyWrapper = wrapper.find(Dummy)

    expect(onKeyRemainUp).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    dummyWrapper.prop('onKeyUp')()

    // 2. simulate going over time
    jest.runTimersToTime(500)

    expect(onKeyRemainUp).toHaveBeenCalledTimes(1)
  })

  it('calls handler after key up & specified duration', () => {
    const EnhancedAnchor = withKeyRemainUp(450)('a')

    let onKeyRemainUp = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onKeyRemainUp-450={onKeyRemainUp}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onKeyRemainUp).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('keyup')

    // 2. simulate going over time
    jest.runTimersToTime(450)

    expect(onKeyRemainUp).toHaveBeenCalledTimes(1)
  })

  it('does not call handler if key down happens before duration expires', () => {
    const EnhancedDummy = withKeyRemainUp()(Dummy)

    let onKeyRemainUp = jest.fn()
    let wrapper = shallow(<EnhancedDummy onKeyRemainUp={onKeyRemainUp} />)
    let dummyWrapper = wrapper.find(Dummy)

    expect(onKeyRemainUp).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    dummyWrapper.prop('onKeyUp')()

    // 2. simulate some time passing
    jest.runTimersToTime(450)

    // 3. simulate cancel event
    dummyWrapper.prop('onKeyDown')()

    // 4. simulate going over time
    jest.runTimersToTime(800)

    expect(onKeyRemainUp).toHaveBeenCalledTimes(0)
  })
})
