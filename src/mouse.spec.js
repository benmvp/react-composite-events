// @flow
import React from 'react'
import {shallow, mount} from 'enzyme'
import type {ReactWrapper} from 'enzyme'
import {
  withMouseRest,
  withMouseRemainOut,
  withMouseRemainOver,
  composeMouseModifierKey,
  withOnlyClick,
  withAltClick,
  withCtrlClick,
  withMetaClick,
  withShiftClick,
  withMouseEnterLeft,
  withMouseEnterRight,
  withMouseEnterTop,
  withMouseEnterBottom,
  withMouseLeaveLeft,
  withMouseLeaveRight,
  withMouseLeaveTop,
  withMouseLeaveBottom
} from './mouse'

jest.useFakeTimers()

const overrideBoundingRect = (
  wrapper: ReactWrapper,
  {top = 50, left = 50, bottom = 150, right = 150} = {}
): ReactWrapper => {
  let newWrapper = wrapper

  // $FlowIgnore
  newWrapper.getDOMNode().getBoundingClientRect = () => ({
    top,
    left,
    bottom,
    right,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  })

  return newWrapper
}

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

describe('`composeMouseModifierKey`', () => {
  describe('error handling', () => {
    it('throws an error if no configuration object is specified', () => {
      // $FlowIgnore: error handling test case
      expect(() => composeMouseModifierKey()).toThrow()
    })

    it('throws an error if no configurations are specified', () => {
      // $FlowIgnore: error handling test case
      expect(() => composeMouseModifierKey({})).toThrow()
    })

    it('throws an error if no `mouseEvent` is specified when `eventPropName` is', () => {
      expect(() =>
        // $FlowIgnore: error handling test case
        composeMouseModifierKey({
          eventPropName: 'compositeEvent',
        })
      ).toThrow()
    })

    it('throws an error if no `eventPropName` is specified when `mouseEvent` is', () => {
      expect(() =>
        // $FlowIgnore: error handling test case
        composeMouseModifierKey({
          mouseEvent: 'onMouseEnter',
        })
      ).toThrow()
    })

    it('does not throw an error when `eventPropName` & `mouseEvent` configurations are specified', () => {
      const withMouseModifierKey = () =>
        composeMouseModifierKey({
          eventPropName: 'compositeEvent',
          mouseEvent: 'onMouseLeave',
        })

      expect(withMouseModifierKey).not.toThrow()

      let mouseModifierKeyHOC = withMouseModifierKey()

      expect(mouseModifierKeyHOC).toBeDefined()
      expect(mouseModifierKeyHOC).not.toBeNull()
      expect(mouseModifierKeyHOC).toBeInstanceOf(Function)
    })
  })

  type Config = {
    alt: boolean,
    ctrl: boolean,
    meta: boolean,
    shift: boolean,
  }
  type KeyConfig = {
    altKey: boolean,
    ctrlKey: boolean,
    metaKey: boolean,
    shiftKey: boolean,
  }

  const FLAG_OPTIONS = [false, true]
  const _genFlags = (callback: Config => void) => {
    for (let shift of FLAG_OPTIONS) {
      for (let meta of FLAG_OPTIONS) {
        for (let ctrl of FLAG_OPTIONS) {
          for (let alt of FLAG_OPTIONS) {
            callback({alt, ctrl, meta, shift})
          }
        }
      }
    }
  }
  const _configToKeys = (config: Config): KeyConfig => {
    let keys = {
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    }

    for (let configName of Object.keys(config)) {
      keys[`${configName}Key`] = config[configName]
    }

    return keys
  }
  const _flipValues = (obj: KeyConfig): KeyConfig => {
    let flippedObj = {...obj}

    for (let key of Object.keys(flippedObj)) {
      flippedObj[key] = !flippedObj[key]
    }

    return flippedObj
  }

  describe('flags', () => {
    _genFlags((keyConfig) => {
      describe(JSON.stringify(keyConfig), () => {
        it('calls handler when there is an exact match of modifier keys', () => {
          const withMouseModifierKey = composeMouseModifierKey({
            eventPropName: 'onCompositeEvent',
            mouseEvent: 'onMouseUp',
            ...keyConfig,
          })
          const EnhancedNav = withMouseModifierKey()('nav')

          let onCompositeEvent = jest.fn()
          let wrapper = shallow(
            <EnhancedNav onCompositeEvent={onCompositeEvent} />
          )
          let navWrapper = wrapper.find('nav')
          let fakeEventObject = _configToKeys(keyConfig)

          // simulate trigger event
          navWrapper.simulate('mouseup', fakeEventObject)

          expect(onCompositeEvent).toHaveBeenCalledTimes(1)
          expect(onCompositeEvent).toHaveBeenCalledWith(fakeEventObject)
        })

        it('does not call handler when there is not an exact match of modifier keys', () => {
          const withMouseModifierKey = composeMouseModifierKey({
            eventPropName: 'onCompositeEvent',
            mouseEvent: 'onMouseLeave',
            ...keyConfig,
          })
          const EnhancedNav = withMouseModifierKey()('nav')

          let onCompositeEvent = jest.fn()
          let wrapper = shallow(
            <EnhancedNav onCompositeEvent={onCompositeEvent} />
          )
          let navWrapper = wrapper.find('nav')
          let fakeEventObject = _flipValues(_configToKeys(keyConfig))

          // simulate trigger event
          navWrapper.simulate('mouseleave', fakeEventObject)

          expect(onCompositeEvent).toHaveBeenCalledTimes(0)
        })
      })
    })
  })
})

describe('`withOnlyClick`', () => {
  it('calls handler when no modifier keys are pressed', () => {
    const EnhancedDiv = withOnlyClick()('div')

    let onOnlyClick = jest.fn()
    let wrapper = shallow(<EnhancedDiv onOnlyClick={onOnlyClick} />)
    let divWrapper = wrapper.find('div')
    let fakeEventObject = {
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    }

    // simulate trigger event
    divWrapper.simulate('click', fakeEventObject)

    expect(onOnlyClick).toHaveBeenCalledTimes(1)
    expect(onOnlyClick).toHaveBeenCalledWith(fakeEventObject)
  })

  it('does not call handler when a modifier key is pressed', () => {
    const EnhancedDiv = withOnlyClick()('div')

    let onOnlyClick = jest.fn()
    let wrapper = shallow(<EnhancedDiv onOnlyClick={onOnlyClick} />)
    let divWrapper = wrapper.find('div')
    let fakeEventObject = {
      altKey: false,
      ctrlKey: false,
      metaKey: true,
      shiftKey: false,
    }

    // simulate trigger event
    divWrapper.simulate('click', fakeEventObject)

    expect(onOnlyClick).toHaveBeenCalledTimes(0)
  })
})

describe('`withAltClick`', () => {
  it('calls handler when only Alt modifier key is pressed', () => {
    const EnhancedDiv = withAltClick()('div')

    let onAltClick = jest.fn()
    let wrapper = shallow(<EnhancedDiv onAltClick={onAltClick} />)
    let divWrapper = wrapper.find('div')
    let fakeEventObject = {
      altKey: true,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    }

    // simulate trigger event
    divWrapper.simulate('click', fakeEventObject)

    expect(onAltClick).toHaveBeenCalledTimes(1)
    expect(onAltClick).toHaveBeenCalledWith(fakeEventObject)
  })

  it('does not call handler when more than just the Alt modifier key is pressed', () => {
    const EnhancedDiv = withAltClick()('div')

    let onAltClick = jest.fn()
    let wrapper = shallow(<EnhancedDiv onAltClick={onAltClick} />)
    let divWrapper = wrapper.find('div')
    let fakeEventObject = {
      altKey: true,
      ctrlKey: false,
      metaKey: true,
      shiftKey: false,
    }

    // simulate trigger event
    divWrapper.simulate('click', fakeEventObject)

    expect(onAltClick).toHaveBeenCalledTimes(0)
  })
})

describe('`withCtrlClick`', () => {
  it('calls handler when only Ctrl modifier key is pressed', () => {
    const EnhancedDiv = withCtrlClick()('div')

    let onCtrlClick = jest.fn()
    let wrapper = shallow(<EnhancedDiv onCtrlClick={onCtrlClick} />)
    let divWrapper = wrapper.find('div')
    let fakeEventObject = {
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
    }

    // simulate trigger event
    divWrapper.simulate('click', fakeEventObject)

    expect(onCtrlClick).toHaveBeenCalledTimes(1)
    expect(onCtrlClick).toHaveBeenCalledWith(fakeEventObject)
  })

  it('does not call handler when more than just the Ctrl modifier key is pressed', () => {
    const EnhancedDiv = withCtrlClick()('div')

    let onCtrlClick = jest.fn()
    let wrapper = shallow(<EnhancedDiv onCtrlClick={onCtrlClick} />)
    let divWrapper = wrapper.find('div')
    let fakeEventObject = {
      altKey: true,
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
    }

    // simulate trigger event
    divWrapper.simulate('click', fakeEventObject)

    expect(onCtrlClick).toHaveBeenCalledTimes(0)
  })
})

describe('`withMetaClick`', () => {
  it('calls handler when only Meta modifier key is pressed', () => {
    const EnhancedDiv = withMetaClick()('div')

    let onMetaClick = jest.fn()
    let wrapper = shallow(<EnhancedDiv onMetaClick={onMetaClick} />)
    let divWrapper = wrapper.find('div')
    let fakeEventObject = {
      altKey: false,
      ctrlKey: false,
      metaKey: true,
      shiftKey: false,
    }

    // simulate trigger event
    divWrapper.simulate('click', fakeEventObject)

    expect(onMetaClick).toHaveBeenCalledTimes(1)
    expect(onMetaClick).toHaveBeenCalledWith(fakeEventObject)
  })

  it('does not call handler when more than just the Meta modifier key is pressed', () => {
    const EnhancedDiv = withMetaClick()('div')

    let onMetaClick = jest.fn()
    let wrapper = shallow(<EnhancedDiv onMetaClick={onMetaClick} />)
    let divWrapper = wrapper.find('div')
    let fakeEventObject = {
      altKey: false,
      ctrlKey: true,
      metaKey: true,
      shiftKey: false,
    }

    // simulate trigger event
    divWrapper.simulate('click', fakeEventObject)

    expect(onMetaClick).toHaveBeenCalledTimes(0)
  })
})

describe('`withShiftClick`', () => {
  it('calls handler when only Shift modifier key is pressed', () => {
    const EnhancedDiv = withShiftClick()('div')

    let onShiftClick = jest.fn()
    let wrapper = shallow(<EnhancedDiv onShiftClick={onShiftClick} />)
    let divWrapper = wrapper.find('div')
    let fakeEventObject = {
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: true,
    }

    // simulate trigger event
    divWrapper.simulate('click', fakeEventObject)

    expect(onShiftClick).toHaveBeenCalledTimes(1)
    expect(onShiftClick).toHaveBeenCalledWith(fakeEventObject)
  })

  it('does not call handler when more than just the Shift modifier key is pressed', () => {
    const EnhancedDiv = withShiftClick()('div')

    let onShiftClick = jest.fn()
    let wrapper = shallow(<EnhancedDiv onShiftClick={onShiftClick} />)
    let divWrapper = wrapper.find('div')
    let fakeEventObject = {
      altKey: false,
      ctrlKey: true,
      metaKey: false,
      shiftKey: true,
    }

    // simulate trigger event
    divWrapper.simulate('click', fakeEventObject)

    expect(onShiftClick).toHaveBeenCalledTimes(0)
  })
})

describe('`withMouseEnterLeft`', () => {
  it('calls handler when mouse enters from the left side', () => {
    const EnhancedDiv = withMouseEnterLeft()('div')

    let onMouseEnterLeft = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterLeft={onMouseEnterLeft} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterLeft).toHaveBeenCalledTimes(1)
    expect(onMouseEnterLeft.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('does not call handler when mouse enters from the right side', () => {
    const EnhancedDiv = withMouseEnterLeft()('div')

    let onMouseEnterLeft = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterLeft={onMouseEnterLeft} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterLeft).toHaveBeenCalledTimes(0)
  })

  it('does not call handler when mouse leaves from the left side', () => {
    const EnhancedDiv = withMouseEnterLeft()('div')

    let onMouseEnterLeft = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterLeft={onMouseEnterLeft} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseEnterLeft).toHaveBeenCalledTimes(0)
  })

  it('calls handler when mouse enters from top-left corner', () => {
    const EnhancedDiv = withMouseEnterLeft()('div')

    let onMouseEnterLeft = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterLeft={onMouseEnterLeft} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterLeft).toHaveBeenCalledTimes(1)
    expect(onMouseEnterLeft.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('calls handler when mouse enters from bottom-left corner', () => {
    const EnhancedDiv = withMouseEnterLeft()('div')

    let onMouseEnterLeft = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterLeft={onMouseEnterLeft} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterLeft).toHaveBeenCalledTimes(1)
    expect(onMouseEnterLeft.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })
})

describe('`withMouseEnterRight`', () => {
  it('calls handler when mouse enters from the right side', () => {
    const EnhancedDiv = withMouseEnterRight()('div')

    let onMouseEnterRight = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterRight={onMouseEnterRight} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterRight).toHaveBeenCalledTimes(1)
    expect(onMouseEnterRight.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('does not call handler when mouse enters from the left side', () => {
    const EnhancedDiv = withMouseEnterRight()('div')

    let onMouseEnterRight = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterRight={onMouseEnterRight} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterRight).toHaveBeenCalledTimes(0)
  })

  it('does not call handler when mouse leaves from the right side', () => {
    const EnhancedDiv = withMouseEnterRight()('div')

    let onMouseEnterRight = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterRight={onMouseEnterRight} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseEnterRight).toHaveBeenCalledTimes(0)
  })

  it('calls handler when mouse enters from top-right corner', () => {
    const EnhancedDiv = withMouseEnterRight()('div')

    let onMouseEnterRight = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterRight={onMouseEnterRight} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterRight).toHaveBeenCalledTimes(1)
    expect(onMouseEnterRight.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('calls handler when mouse enters from bottom-right corner', () => {
    const EnhancedDiv = withMouseEnterRight()('div')

    let onMouseEnterRight = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterRight={onMouseEnterRight} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterRight).toHaveBeenCalledTimes(1)
    expect(onMouseEnterRight.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })
})

describe('`withMouseEnterTop`', () => {
  it('calls handler when mouse enters from the top side', () => {
    const EnhancedDiv = withMouseEnterTop()('div')

    let onMouseEnterTop = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterTop={onMouseEnterTop} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterTop).toHaveBeenCalledTimes(1)
    expect(onMouseEnterTop.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('does not call handler when mouse enters from the bottom side', () => {
    const EnhancedDiv = withMouseEnterTop()('div')

    let onMouseEnterTop = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterTop={onMouseEnterTop} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterTop).toHaveBeenCalledTimes(0)
  })

  it('does not call handler when mouse leaves from the top side', () => {
    const EnhancedDiv = withMouseEnterTop()('div')

    let onMouseEnterTop = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterTop={onMouseEnterTop} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseEnterTop).toHaveBeenCalledTimes(0)
  })

  it('calls handler when mouse enters from top-left corner', () => {
    const EnhancedDiv = withMouseEnterTop()('div')

    let onMouseEnterTop = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterTop={onMouseEnterTop} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterTop).toHaveBeenCalledTimes(1)
    expect(onMouseEnterTop.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('calls handler when mouse enters from top-right corner', () => {
    const EnhancedDiv = withMouseEnterTop()('div')

    let onMouseEnterTop = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterTop={onMouseEnterTop} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterTop).toHaveBeenCalledTimes(1)
    expect(onMouseEnterTop.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })
})

describe('`withMouseEnterBottom`', () => {
  it('calls handler when mouse enters from the bottom side', () => {
    const EnhancedDiv = withMouseEnterBottom()('div')

    let onMouseEnterBottom = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterBottom={onMouseEnterBottom} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterBottom).toHaveBeenCalledTimes(1)
    expect(onMouseEnterBottom.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('does not call handler when mouse enters from the top side', () => {
    const EnhancedDiv = withMouseEnterBottom()('div')

    let onMouseEnterBottom = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterBottom={onMouseEnterBottom} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterBottom).toHaveBeenCalledTimes(0)
  })

  it('does not call handler when mouse leaves from the bottom side', () => {
    const EnhancedDiv = withMouseEnterBottom()('div')

    let onMouseEnterBottom = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterBottom={onMouseEnterBottom} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseEnterBottom).toHaveBeenCalledTimes(0)
  })

  it('calls handler when mouse enters from bottom-left corner', () => {
    const EnhancedDiv = withMouseEnterBottom()('div')

    let onMouseEnterBottom = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterBottom={onMouseEnterBottom} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterBottom).toHaveBeenCalledTimes(1)
    expect(onMouseEnterBottom.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('calls handler when mouse enters from bottom-right corner', () => {
    const EnhancedDiv = withMouseEnterBottom()('div')

    let onMouseEnterBottom = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseEnterBottom={onMouseEnterBottom} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseEnterBottom).toHaveBeenCalledTimes(1)
    expect(onMouseEnterBottom.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })
})

describe('`withMouseLeaveLeft`', () => {
  it('calls handler when mouse leaves from the left side', () => {
    const EnhancedDiv = withMouseLeaveLeft()('div')

    let onMouseLeaveLeft = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveLeft={onMouseLeaveLeft} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveLeft).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveLeft.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('does not call handler when mouse leaves from the right side', () => {
    const EnhancedDiv = withMouseLeaveLeft()('div')

    let onMouseLeaveLeft = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveLeft={onMouseLeaveLeft} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveLeft).toHaveBeenCalledTimes(0)
  })

  it('does not call handler when mouse enters from the left side', () => {
    const EnhancedDiv = withMouseLeaveLeft()('div')

    let onMouseLeaveLeft = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveLeft={onMouseLeaveLeft} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseLeaveLeft).toHaveBeenCalledTimes(0)
  })

  it('calls handler when mouse leaves from top-left corner', () => {
    const EnhancedDiv = withMouseLeaveLeft()('div')

    let onMouseLeaveLeft = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveLeft={onMouseLeaveLeft} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveLeft).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveLeft.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('calls handler when mouse leaves from bottom-left corner', () => {
    const EnhancedDiv = withMouseLeaveLeft()('div')

    let onMouseLeaveLeft = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveLeft={onMouseLeaveLeft} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveLeft).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveLeft.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })
})

describe('`withMouseLeaveRight`', () => {
  it('calls handler when mouse leaves from the right side', () => {
    const EnhancedDiv = withMouseLeaveRight()('div')

    let onMouseLeaveRight = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveRight={onMouseLeaveRight} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveRight).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveRight.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('does not call handler when mouse leaves from the left side', () => {
    const EnhancedDiv = withMouseLeaveRight()('div')

    let onMouseLeaveRight = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveRight={onMouseLeaveRight} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveRight).toHaveBeenCalledTimes(0)
  })

  it('does not call handler when mouse enters from the right side', () => {
    const EnhancedDiv = withMouseLeaveRight()('div')

    let onMouseLeaveRight = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveRight={onMouseLeaveRight} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 100,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseLeaveRight).toHaveBeenCalledTimes(0)
  })

  it('calls handler when mouse leaves from top-right corner', () => {
    const EnhancedDiv = withMouseLeaveRight()('div')

    let onMouseLeaveRight = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveRight={onMouseLeaveRight} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveRight).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveRight.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('calls handler when mouse leaves from bottom-right corner', () => {
    const EnhancedDiv = withMouseLeaveRight()('div')

    let onMouseLeaveRight = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveRight={onMouseLeaveRight} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveRight).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveRight.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })
})

describe('`withMouseLeaveTop`', () => {
  it('calls handler when mouse leaves from the top side', () => {
    const EnhancedDiv = withMouseLeaveTop()('div')

    let onMouseLeaveTop = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveTop={onMouseLeaveTop} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveTop).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveTop.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('does not call handler when mouse leaves from the bottom side', () => {
    const EnhancedDiv = withMouseLeaveTop()('div')

    let onMouseLeaveTop = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveTop={onMouseLeaveTop} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveTop).toHaveBeenCalledTimes(0)
  })

  it('does not call handler when mouse enters from the top side', () => {
    const EnhancedDiv = withMouseLeaveTop()('div')

    let onMouseLeaveTop = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveTop={onMouseLeaveTop} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseLeaveTop).toHaveBeenCalledTimes(0)
  })

  it('calls handler when mouse leaves from top-left corner', () => {
    const EnhancedDiv = withMouseLeaveTop()('div')

    let onMouseLeaveTop = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveTop={onMouseLeaveTop} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveTop).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveTop.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('calls handler when mouse leaves from top-right corner', () => {
    const EnhancedDiv = withMouseLeaveTop()('div')

    let onMouseLeaveTop = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveTop={onMouseLeaveTop} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveTop).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveTop.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })
})

describe('`withMouseLeaveBottom`', () => {
  it('calls handler when mouse leaves from the bottom side', () => {
    const EnhancedDiv = withMouseLeaveBottom()('div')

    let onMouseLeaveBottom = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveBottom={onMouseLeaveBottom} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveBottom).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveBottom.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('does not call handler when mouse leaves from the top side', () => {
    const EnhancedDiv = withMouseLeaveBottom()('div')

    let onMouseLeaveBottom = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveBottom={onMouseLeaveBottom} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 50,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveBottom).toHaveBeenCalledTimes(0)
  })

  it('does not call handler when mouse enters from the bottom side', () => {
    const EnhancedDiv = withMouseLeaveBottom()('div')

    let onMouseLeaveBottom = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveBottom={onMouseLeaveBottom} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 100,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseenter', fakeEventObject)

    expect(onMouseLeaveBottom).toHaveBeenCalledTimes(0)
  })

  it('calls handler when mouse leaves from bottom-left corner', () => {
    const EnhancedDiv = withMouseLeaveBottom()('div')

    let onMouseLeaveBottom = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveBottom={onMouseLeaveBottom} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 50,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveBottom).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveBottom.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })

  it('calls handler when mouse leaves from bottom-right corner', () => {
    const EnhancedDiv = withMouseLeaveBottom()('div')

    let onMouseLeaveBottom = jest.fn()
    let wrapper = mount(<EnhancedDiv onMouseLeaveBottom={onMouseLeaveBottom} />)
    let divWrapper = overrideBoundingRect(wrapper.find('div'))
    let fakeEventObject = {
      screenX: 150,
      screenY: 150,
    }

    // simulate trigger event
    divWrapper.simulate('mouseleave', fakeEventObject)

    expect(onMouseLeaveBottom).toHaveBeenCalledTimes(1)
    expect(onMouseLeaveBottom.mock.calls[0][0]).toMatchObject(fakeEventObject)
  })
})
