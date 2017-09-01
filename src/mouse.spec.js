// @flow
import React from 'react'
import {shallow} from 'enzyme'
import {
  withMouseRest,
  withMouseRemainOut,
  withMouseRemainOver,
  composeMouseModifierKey,
  withOnlyClick,
  withAltClick,
  withCtrlClick,
  withMetaClick,
  withShiftClick
} from './mouse'

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
