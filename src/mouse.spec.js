import React from 'react'
import {shallow} from 'enzyme'
import {withMouseRest, withMouseRemainOut, withMouseRemainOver} from './mouse'

jest.useFakeTimers()

describe('`withMouseRest`', () => {
  it('calls handler after mouse over & default 500 ms', () => {
    const EnhancedAnchor = withMouseRest()('a')

    let onMouseRest = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor href="http://www.benmvp.com/" onMouseRest={onMouseRest} />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRest).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseover')

    // 2. simulate going over time
    jest.runTimersToTime(500)

    expect(onMouseRest).toHaveBeenCalledTimes(1)
  })

  it('calls handler after mouse move & default 500 ms', () => {
    const EnhancedAnchor = withMouseRest()('a')

    let onMouseRest = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor href="http://www.benmvp.com/" onMouseRest={onMouseRest} />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRest).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mousemove')

    // 2. simulate going over time
    jest.runTimersToTime(500)

    expect(onMouseRest).toHaveBeenCalledTimes(1)
  })

  it('calls handler after mouse over & specified duration', () => {
    const EnhancedAnchor = withMouseRest(450)('a')

    let onMouseRest = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRest-450={onMouseRest}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRest).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseover')

    // 2. simulate going over time
    jest.runTimersToTime(450)

    expect(onMouseRest).toHaveBeenCalledTimes(1)
  })

  it('calls handler after mouse move & specified duration', () => {
    const EnhancedAnchor = withMouseRest(450)('a')

    let onMouseRest = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRest-450={onMouseRest}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRest).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mousemove')

    // 2. simulate going over time
    jest.runTimersToTime(450)

    expect(onMouseRest).toHaveBeenCalledTimes(1)
  })

  it('does not call handler if mouse out happens before duration expires', () => {
    const EnhancedAnchor = withMouseRest()('a')

    let onMouseRest = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor href="http://www.benmvp.com/" onMouseRest={onMouseRest} />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRest).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseover')

    // 2. simulate some time passing
    jest.runTimersToTime(150)

    // 3. simulate cancel event
    anchorWrapper.simulate('mouseout')

    // 4. simulate going over time
    jest.runTimersToTime(350)

    expect(onMouseRest).toHaveBeenCalledTimes(0)
  })

  it('does not call handler if mouse down happens before duration expires', () => {
    const EnhancedAnchor = withMouseRest()('a')

    let onMouseRest = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor href="http://www.benmvp.com/" onMouseRest={onMouseRest} />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRest).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mousemove')

    // 2. simulate some time passing
    jest.runTimersToTime(150)

    // 3. simulate cancel event
    anchorWrapper.simulate('mousedown')

    // 4. simulate going over time
    jest.runTimersToTime(350)

    expect(onMouseRest).toHaveBeenCalledTimes(0)
  })

  it('delays calling handler if trigger event happens before duration expires', () => {
    const EnhancedAnchor = withMouseRest()('a')

    let onMouseRest = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor href="http://www.benmvp.com/" onMouseRest={onMouseRest} />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRest).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseover')

    // 2. simulate some time passing
    jest.runTimersToTime(150)

    // 3. simulate trigger again before time has expired
    anchorWrapper.simulate('mousemove')

    // 4. simulate going over initial duration time
    jest.runTimersToTime(350)

    // shouldn't have been called cuz timer was reset
    expect(onMouseRest).toHaveBeenCalledTimes(0)

    // 5. simulate going over time for real
    jest.runTimersToTime(150)

    expect(onMouseRest).toHaveBeenCalledTimes(1)
  })
})

describe('`withMouseRemainOver`', () => {
  it('calls handler after mouse over & default 500 ms', () => {
    const EnhancedAnchor = withMouseRemainOver()('a')

    let onMouseRemainOver = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRemainOver={onMouseRemainOver}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRemainOver).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseover')

    // 2. simulate going over time
    jest.runTimersToTime(500)

    expect(onMouseRemainOver).toHaveBeenCalledTimes(1)
  })

  it('calls handler after mouse move & default 500 ms', () => {
    const EnhancedAnchor = withMouseRemainOver()('a')

    let onMouseRemainOver = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRemainOver={onMouseRemainOver}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRemainOver).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mousemove')

    // 2. simulate going over time
    jest.runTimersToTime(500)

    expect(onMouseRemainOver).toHaveBeenCalledTimes(1)
  })

  it('calls handler after mouse over & specified duration', () => {
    const EnhancedAnchor = withMouseRemainOver(450)('a')

    let onMouseRemainOver = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRemainOver-450={onMouseRemainOver}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRemainOver).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseover')

    // 2. simulate going over time
    jest.runTimersToTime(450)

    expect(onMouseRemainOver).toHaveBeenCalledTimes(1)
  })

  it('calls handler after mouse move & specified duration', () => {
    const EnhancedAnchor = withMouseRemainOver(450)('a')

    let onMouseRemainOver = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRemainOver-450={onMouseRemainOver}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRemainOver).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mousemove')

    // 2. simulate going over time
    jest.runTimersToTime(450)

    expect(onMouseRemainOver).toHaveBeenCalledTimes(1)
  })

  it('does not call handler if mouse out happens before duration expires', () => {
    const EnhancedAnchor = withMouseRemainOver()('a')

    let onMouseRemainOver = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRemainOver={onMouseRemainOver}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRemainOver).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseover')

    // 2. simulate some time passing
    jest.runTimersToTime(150)

    // 3. simulate cancel event
    anchorWrapper.simulate('mouseout')

    // 4. simulate going over time
    jest.runTimersToTime(350)

    expect(onMouseRemainOver).toHaveBeenCalledTimes(0)
  })

  it('does not call handler if mouse down happens before duration expires', () => {
    const EnhancedAnchor = withMouseRemainOver()('a')

    let onMouseRemainOver = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRemainOver={onMouseRemainOver}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRemainOver).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mousemove')

    // 2. simulate some time passing
    jest.runTimersToTime(150)

    // 3. simulate cancel event
    anchorWrapper.simulate('mousedown')

    // 4. simulate going over time
    jest.runTimersToTime(350)

    expect(onMouseRemainOver).toHaveBeenCalledTimes(0)
  })

  it('does not delay calling handler if trigger event happens before duration expires', () => {
    const EnhancedAnchor = withMouseRemainOver()('a')

    let onMouseRemainOver = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRemainOver={onMouseRemainOver}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRemainOver).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseover')

    // 2. simulate some time passing
    jest.runTimersToTime(150)

    // 3. simulate trigger again before time has expired
    anchorWrapper.simulate('mousemove')

    // 4. simulate going over initial duration time
    jest.runTimersToTime(350)

    // should've been called because retrigger should've been ignored
    expect(onMouseRemainOver).toHaveBeenCalledTimes(1)

    // 5. simulate going over what could be the reset duration
    jest.runTimersToTime(150)

    expect(onMouseRemainOver).toHaveBeenCalledTimes(1)
  })
})

describe('`withMouseRemainOut`', () => {
  it('calls handler after mouse out & default 500 ms', () => {
    const EnhancedAnchor = withMouseRemainOut()('a')

    let onMouseRemainOut = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRemainOut={onMouseRemainOut}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRemainOut).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseout')

    // 2. simulate going over time
    jest.runTimersToTime(500)

    expect(onMouseRemainOut).toHaveBeenCalledTimes(1)
  })

  it('calls handler after mouse out & specified duration', () => {
    const EnhancedAnchor = withMouseRemainOut(123)('a')

    let onMouseRemainOut = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRemainOut-123={onMouseRemainOut}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRemainOut).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseout')

    // 2. simulate going over time
    jest.runTimersToTime(123)

    expect(onMouseRemainOut).toHaveBeenCalledTimes(1)
  })

  it('does not call handler if mouse over happens before duration expires', () => {
    const EnhancedAnchor = withMouseRemainOut()('a')

    let onMouseRemainOut = jest.fn()
    let wrapper = shallow(
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onMouseRemainOut={onMouseRemainOut}
      />
    )
    let anchorWrapper = wrapper.find('a')

    expect(onMouseRemainOut).toHaveBeenCalledTimes(0)

    // 1. simulate trigger
    anchorWrapper.simulate('mouseout')

    // 2. simulate some time passing
    jest.runTimersToTime(150)

    // 3. simulate cancel event
    anchorWrapper.simulate('mouseover')

    // 4. simulate going over time
    jest.runTimersToTime(350)

    expect(onMouseRemainOut).toHaveBeenCalledTimes(0)
  })
})
