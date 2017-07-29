/* eslint-disable no-empty-function */
import React from 'react'
import {shallow, mount} from 'enzyme'
import {compose} from './'

const Dummy = () => <div />

const withMouseRest = compose({
  eventPropName: 'onMouseRest',
  triggerEvent: ['onMouseOver', 'onMouseMove'],
  defaultDuration: 150,
  cancelEvent: ['onMouseOut', 'onMouseDown'],
  shouldResetTimerOnRetrigger: true,
  allowRefire: false,
})

const EnhancedSampleAnchor = withMouseRest()('a')
const EnhancedSampleDummy = withMouseRest()(Dummy)

jest.useFakeTimers()

describe('compose', () => {
  describe('error handling', () => {
    it('throws an error if no configuration object is specified', () => {
      expect(() => compose()).toThrow()
    })

    it('throws an error if no configurations are specified', () => {
      expect(() => compose({})).toThrow()
    })

    it('throws an error if no `triggerEvent` is specified when `eventPropName` is', () => {
      expect(() =>
        compose({
          eventPropName: 'compositeEvent',
        })
      ).toThrow()
    })

    it('throws an error if no `eventPropName` is specified when `triggerEvent` is', () => {
      expect(() =>
        compose({
          triggerEvent: 'onClick',
        })
      ).toThrow()
    })

    it('does not throw an error when `eventPropName` & `triggerEvent` configurations are specified', () => {
      let getCompositeEventHOC = () =>
        compose({
          eventPropName: 'compositeEvent',
          triggerEvent: 'onClick',
        })

      expect(getCompositeEventHOC).not.toThrow()

      let compositeEventHOC = getCompositeEventHOC()

      expect(compositeEventHOC).toBeDefined()
      expect(compositeEventHOC).not.toBeNull()
      expect(compositeEventHOC).toBeInstanceOf(Function)
    })
  })

  describe('simple cases', () => {
    it('triggers composite event on a wrapped DOM element', () => {
      let onMouseRest = jest.fn()
      let wrapper = shallow(
        <EnhancedSampleAnchor
          href="http://www.benmvp.com/"
          onMouseRest={onMouseRest}
        />
      )
      let anchorWrapper = wrapper.find('a')

      expect(onMouseRest).toHaveBeenCalledTimes(0)

      // 1. simulate mouse over
      anchorWrapper.simulate('mouseover')

      // 2. simulate remaining over
      jest.runTimersToTime(400)

      expect(onMouseRest).toHaveBeenCalledTimes(1)
    })

    it('triggers composite event on a wrapped custom Component', () => {
      let onMouseRest = jest.fn()
      let wrapper = shallow(<EnhancedSampleDummy onMouseRest={onMouseRest} />)
      let dummyWrapper = wrapper.find(Dummy)

      expect(onMouseRest).toHaveBeenCalledTimes(0)

      // 1. simulate mouse over
      dummyWrapper.prop('onMouseOver')()

      // 2. simulate remaining over
      jest.runTimersToTime(400)

      expect(onMouseRest).toHaveBeenCalledTimes(1)
    })
  })

  describe('`triggerEvent` config', () => {
    it('triggers composite event for a single string', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('triggers composite event for multiple strings', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onMouseDown', 'onMouseUp'],
      })
      const EnhancedDiv = withCompositeEvent()('div')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(<EnhancedDiv onCompositeEvent={onCompositeEvent} />)
      let divWrapper = wrapper.find('div')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // first simulate first trigger event
      divWrapper.simulate('mousedown')

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)

      // second simulate second trigger event
      divWrapper.simulate('mouseup')

      expect(onCompositeEvent).toHaveBeenCalledTimes(2)
    })

    it('does not blow up when composite event handler is not passed', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onMouseDown', 'onMouseUp'],
      })
      const EnhancedDiv = withCompositeEvent()('div')

      let wrapper = shallow(<EnhancedDiv />)
      let divWrapper = wrapper.find('div')

      // verify that simulating trigger event even though composite even thandler
      // wasn't passed doesn't blow up
      expect(() => divWrapper.simulate('mousedown')).not.toThrow()
    })

    it('does not blow up passing unsupported events', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onMouseDown', 'onPressIn'],
      })
      const EnhancedSection = withCompositeEvent()('section')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedSection onCompositeEvent={onCompositeEvent} />
      )
      let sectionWrapper = wrapper.find('section')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate supported trigger event
      sectionWrapper.simulate('mousedown')

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('does not trigger composite event when non trigger event happens', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onMouseEnter',
      })
      const EnhancedLabel = withCompositeEvent()('label')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedLabel onCompositeEvent={onCompositeEvent} />
      )
      let sectionWrapper = wrapper.find('label')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate non trigger event
      sectionWrapper.simulate('mousedown')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
    })

    it('also calls handler for event matching single `triggerEvent`', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onMouseEnter',
      })
      const EnhancedMain = withCompositeEvent()('main')

      let onCompositeEvent = jest.fn()
      let onMouseEnter = jest.fn()
      let wrapper = shallow(
        <EnhancedMain
          onMouseEnter={onMouseEnter}
          onCompositeEvent={onCompositeEvent}
        />
      )
      let sectionWrapper = wrapper.find('main')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onMouseEnter).toHaveBeenCalledTimes(0)

      // simulate trigger event
      sectionWrapper.simulate('mouseenter')

      // verify both the vanilla & composite events are fired
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onMouseEnter).toHaveBeenCalledTimes(1)
    })

    it('also calls handler for event matching one of events in `triggerEvent`', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onClick', 'onKeyPress'],
      })
      const EnhancedSpan = withCompositeEvent()('span')

      let onCompositeEvent = jest.fn()
      let onClick = jest.fn()
      let wrapper = shallow(
        <EnhancedSpan onClick={onClick} onCompositeEvent={onCompositeEvent} />
      )
      let sectionWrapper = wrapper.find('span')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onClick).toHaveBeenCalledTimes(0)

      // simulate supported trigger event
      sectionWrapper.simulate('click')

      // verify both the vanilla & composite events are fired
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledTimes(1)

      // simulate other trigger event
      sectionWrapper.simulate('keypress')

      // verify composite event gets triggered again but not vanilla event
      expect(onCompositeEvent).toHaveBeenCalledTimes(2)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('passes event object to composite event handler', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onKeyDown', 'onKeyUp'],
      })
      const EnhancedNav = withCompositeEvent()('nav')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(<EnhancedNav onCompositeEvent={onCompositeEvent} />)
      let navWrapper = wrapper.find('nav')
      let fakeEventObject = {}

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate trigger event
      navWrapper.simulate('keydown', fakeEventObject)

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent).toHaveBeenCalledWith(fakeEventObject)
    })

    it('calls 2 different composite event handlers that depend on same trigger event', () => {
      const withCompositeEventA = compose({
        eventPropName: 'onCompositeEventA',
        triggerEvent: 'onMouseOver',
      })
      const withCompositeEventB = compose({
        eventPropName: 'onCompositeEventB',
        triggerEvent: 'onMouseOver',
      })
      const EnhancedNav = withCompositeEventB()(withCompositeEventA()('nav'))

      let onCompositeEventA = jest.fn()
      let onCompositeEventB = jest.fn()
      let wrapper = mount(
        <EnhancedNav
          onCompositeEventA={onCompositeEventA}
          onCompositeEventB={onCompositeEventB}
        />
      )
      let navWrapper = wrapper.find('nav')

      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(0)

      // simulate trigger event
      navWrapper.simulate('mouseover')

      // both handlers should've been called
      expect(onCompositeEventA).toHaveBeenCalledTimes(1)
      expect(onCompositeEventB).toHaveBeenCalledTimes(1)
    })

    it('calls generic handler when specifying duration override', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onKeyDown', 'onKeyUp'],
      })
      const EnhancedNav = withCompositeEvent(500)('nav')

      let onCompositeEvent = jest.fn()
      let onCompositeEvent500 = jest.fn()
      let wrapper = shallow(
        <EnhancedNav
          onCompositeEvent={onCompositeEvent}
          onCompositeEvent-500={onCompositeEvent500}
        />
      )
      let navWrapper = wrapper.find('nav')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent500).toHaveBeenCalledTimes(0)

      // simulate trigger event
      navWrapper.simulate('keydown')

      // should call the unparameterized version
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent500).toHaveBeenCalledTimes(0)

      // fast forward to after the override duration
      jest.runTimersToTime(600)

      // still should only call unparameterized version
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent500).toHaveBeenCalledTimes(0)
    })
  })

  describe('`defaultDuration` config', () => {
    it('calls composite event handler on specified default delay', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 800,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // still shouldn't be called because no time has passed
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(400)

      // still shouldn't be called because delay hasn't fully passed
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(500)

      // should've been called by now
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('calls paramterized composite event handler on specified delay override', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 800,
      })

      // specify delay override
      const EnhancedDummy = withCompositeEvent(300)(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent-300={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // still shouldn't be called because no time has passed
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(200)

      // still shouldn't be called because delay hasn't fully passed
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(200)

      // should've been called by now
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)

      // fast forward past default duration time
      jest.runTimersToTime(500)

      // should not have been called again
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('immediately calls generic composite event handler with specified negative default delay', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: -800,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // should be called immediately
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)

      // run time passed absolute value
      jest.runTimersToTime(825)

      // still should've only been called once
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('still calls generic composite event handler after default duration when duration override is negative', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 650,
      })

      // specify delay override
      const EnhancedDummy = withCompositeEvent(-300)(Dummy)

      let onCompositeEvent = jest.fn()
      let onCompositeEvent300 = jest.fn()
      let onCompositeEvent650 = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy
          onCompositeEvent={onCompositeEvent}
          onCompositeEvent-300={onCompositeEvent300}
          onCompositeEvent-650={onCompositeEvent650}
        />
      )
      let dummyWrapper = wrapper.find(Dummy)

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent300).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent650).toHaveBeenCalledTimes(0)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // neither should be called yet
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent300).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent650).toHaveBeenCalledTimes(0)

      // run time passed absolute value of duration override
      jest.runTimersToTime(325)

      // neither should still be called yet
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent300).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent650).toHaveBeenCalledTimes(0)

      // run time passed default duration
      jest.runTimersToTime(350)

      // the generic composite event should be called now,
      // but not the other ones
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent300).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent650).toHaveBeenCalledTimes(0)
    })

    it('still calls generic composite event handler on specified delay override when default duration is negative', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: -800,
      })

      // specify delay override
      const EnhancedDummy = withCompositeEvent(300)(Dummy)

      let onCompositeEvent = jest.fn()
      let onCompositeEvent300 = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy
          onCompositeEvent={onCompositeEvent}
          onCompositeEvent-300={onCompositeEvent300}
        />
      )
      let dummyWrapper = wrapper.find(Dummy)

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent300).toHaveBeenCalledTimes(0)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // generic should be called immediately
      // parameterized should never be called
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent300).toHaveBeenCalledTimes(0)

      // run time passed absolute value of duration override
      jest.runTimersToTime(325)

      // still should've only been called once
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent300).toHaveBeenCalledTimes(0)
    })

    it('does not call composite event handler with generic name with delay override', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 800,
      })

      // specify delay override
      const EnhancedDummy = withCompositeEvent(500)(Dummy)

      let onCompositeEvent = jest.fn()

      // use generic name instead of expected parameterized name
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      //  shouldn't have been called because no time has passed anyway
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(350)

      // still shouldn't be called because delay hasn't fully passed
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(200)

      // still not called because used the generic name
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
    })

    it('calls multiple composite event handlers with different duration overrides at the right time', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 800,
      })

      // add multiple composite events
      const EnhancedDummy = withCompositeEvent(1000)(
        withCompositeEvent(450)(withCompositeEvent()(Dummy))
      )

      let onCompositeEvent = jest.fn()
      let onCompositeEvent450 = jest.fn()
      let onCompositeEvent1000 = jest.fn()
      let wrapper = mount(
        <EnhancedDummy
          onCompositeEvent={onCompositeEvent}
          onCompositeEvent-450={onCompositeEvent450}
          onCompositeEvent-1000={onCompositeEvent1000}
        />
      )
      let dummyWrapper = wrapper.find(Dummy)

      // obviously not called after
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // still shouldn't be called because no time has passed
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent450).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent1000).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(500)

      // 450 version should've been called but not others
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onCompositeEvent450).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent1000).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(400)

      // 450 version + default should've been called now
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent450).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent1000).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(200)

      // all should've been called now
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent450).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent1000).toHaveBeenCalledTimes(1)
    })
  })

  describe('`cancelEvent` config', () => {
    // TODO: ensure specific handlers matching cancel events are also called
    // TODO: no cancelEvent, 1 string, array of string
  })

  describe('`shouldResetTimerOnRetrigger` config', () => {})

  describe('`defaultDuration` config', () => {})

  describe('`allowRefire` config', () => {})

  describe('`beforeCallback` config', () => {})
})
