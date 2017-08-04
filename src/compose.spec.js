/* eslint-disable no-empty-function */
import React from 'react'
import {shallow, mount} from 'enzyme'
import compose from './compose'

const Dummy = () => <div />

const withMouseRest = compose({
  eventPropName: 'onMouseRest',
  triggerEvent: ['onMouseOver', 'onMouseMove'],
  defaultDuration: 150,
  cancelEvent: ['onMouseOut', 'onMouseDown'],
  shouldResetTimerOnRetrigger: true,
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

    it('throws an error when no component is passed to the resultant HOC', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
      })

      // throws an error because no Component was specified
      expect(() => withCompositeEvent()()).toThrow()
    })

    it('does not pass composite event to underlying component', () => {
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

      expect(dummyWrapper).not.toHaveProp('onCompositeEvent')
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

      // 2. simulate going over time
      jest.runTimersToTime(400)

      expect(onMouseRest).toHaveBeenCalledTimes(1)
    })

    it('cancels composite event on a wrapped DOM element', () => {
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

      // 2. simulate some time passing
      jest.runTimersToTime(100)

      // shouldn't have been called yet because not enough time passed
      expect(onMouseRest).toHaveBeenCalledTimes(0)

      // 3. simulate cancel event
      anchorWrapper.simulate('mousedown')

      // 2. simulate more time passing
      jest.runTimersToTime(100)

      // still shouldn't have been called because of the cancel
      expect(onMouseRest).toHaveBeenCalledTimes(0)
    })

    it('triggers composite event on a wrapped custom Component', () => {
      let onMouseRest = jest.fn()
      let wrapper = shallow(<EnhancedSampleDummy onMouseRest={onMouseRest} />)
      let dummyWrapper = wrapper.find(Dummy)

      expect(onMouseRest).toHaveBeenCalledTimes(0)

      // 1. simulate mouse over
      dummyWrapper.prop('onMouseOver')()

      // 2. simulate going over time
      jest.runTimersToTime(400)

      expect(onMouseRest).toHaveBeenCalledTimes(1)
    })

    it('cancels composite event on a wrapped custom Component', () => {
      let onMouseRest = jest.fn()
      let wrapper = shallow(<EnhancedSampleDummy onMouseRest={onMouseRest} />)
      let dummyWrapper = wrapper.find(Dummy)

      expect(onMouseRest).toHaveBeenCalledTimes(0)

      // 1. simulate mouse over
      dummyWrapper.prop('onMouseOver')()

      // 2. simulate some time passing
      jest.runTimersToTime(100)

      // shouldn't have been called yet because not enough time passed
      expect(onMouseRest).toHaveBeenCalledTimes(0)

      // 3. simulate cancel event
      dummyWrapper.prop('onMouseOut')()

      // 2. simulate more time passing
      jest.runTimersToTime(100)

      // still shouldn't have been called because of the cancel
      expect(onMouseRest).toHaveBeenCalledTimes(0)
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

    it('does not blow up passing unsupported events as triggers', () => {
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
    it('cancels composite event for a single string', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyTriggerEvent',
        defaultDuration: 500,
        cancelEvent: 'onDummyCancelEvent',
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      // simulate dummy trigger event
      dummyWrapper.prop('onDummyTriggerEvent')()

      jest.runTimersToTime(200)

      // simulate dummy cancel event
      dummyWrapper.prop('onDummyCancelEvent')()

      jest.runTimersToTime(400)

      // composite event shouldn't happen because of cancel
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
    })

    it('cancels composite event for multiple strings', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onMouseUp',
        defaultDuration: 350,
        cancelEvent: ['onMouseDown', 'onMouseMove'],
      })
      const EnhancedDiv = withCompositeEvent()('div')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(<EnhancedDiv onCompositeEvent={onCompositeEvent} />)
      let divWrapper = wrapper.find('div')

      // simulate trigger event
      divWrapper.simulate('mouseup')

      jest.runTimersToTime(320)

      // simulate a cancel event right before duration
      divWrapper.simulate('mousedown')

      // run past duration
      jest.runTimersToTime(50)

      // event was cancelled so shouldn't be called
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate trigger event again
      divWrapper.simulate('mouseup')

      // make sure composite event wasn't somehow called since previous time had ended
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(150)

      // simulate other cancel event right before duration
      divWrapper.simulate('mousemove')

      // run past duration
      jest.runTimersToTime(250)

      // event was cancelled again so shouldn't be called
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
    })

    it('does not blow up passing unsupported events as cancel events', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onKeyUp',
        defaultDuration: 900,
        cancelEvent: ['onMouseDown', 'onPressOut'],
      })
      const EnhancedSection = withCompositeEvent()('section')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedSection onCompositeEvent={onCompositeEvent} />
      )
      let sectionWrapper = wrapper.find('section')

      // simulate trigger event
      sectionWrapper.simulate('onKeyUp')

      // run some duration
      jest.runTimersToTime(550)

      // simulate supported cancel event
      sectionWrapper.simulate('onMouseDown')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // run past duration
      jest.runTimersToTime(550)

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
    })

    it('calls composite event when non cancel event happens', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onMouseEnter',
        defaultDuration: 233,
        cancelEvent: 'onMouseLeave',
      })
      const EnhancedLabel = withCompositeEvent()('label')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedLabel onCompositeEvent={onCompositeEvent} />
      )
      let sectionWrapper = wrapper.find('label')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate trigger event
      sectionWrapper.simulate('mouseenter')

      // run some duration
      jest.runTimersToTime(198)

      // simulate non cancel event
      sectionWrapper.simulate('mouseout')

      // run past duration
      jest.runTimersToTime(198)

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('calls composite event when cancel event happens after duration finishes (and does not blow up)', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onMouseEnter',
        defaultDuration: 654,
        cancelEvent: 'onMouseLeave',
      })
      const EnhancedLabel = withCompositeEvent()('label')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedLabel onCompositeEvent={onCompositeEvent} />
      )
      let sectionWrapper = wrapper.find('label')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate trigger event
      sectionWrapper.simulate('mouseenter')

      // run past duration
      jest.runTimersToTime(700)

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)

      // simulate non cancel event
      expect(() => sectionWrapper.simulate('mouseleave')).not.toThrow()

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('calls composite event when cancel event happens w/o duration (and does not blow up)', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onMouseEnter',
        cancelEvent: 'onMouseLeave',
      })
      const EnhancedLabel = withCompositeEvent()('label')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedLabel onCompositeEvent={onCompositeEvent} />
      )
      let sectionWrapper = wrapper.find('label')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate trigger event
      sectionWrapper.simulate('mouseenter')

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)

      // simulate non cancel event
      expect(() => sectionWrapper.simulate('mouseleave')).not.toThrow()

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)

      // run some duration
      jest.runTimersToTime(700)

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('also calls handler for event matching single `cancelEvent`', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onMouseEnter',
        defaultDuration: 482,
        cancelEvent: 'onMouseLeave',
      })
      const EnhancedMain = withCompositeEvent()('main')

      let onCompositeEvent = jest.fn()
      let onMouseLeave = jest.fn()
      let wrapper = shallow(
        <EnhancedMain
          onMouseLeave={onMouseLeave}
          onCompositeEvent={onCompositeEvent}
        />
      )
      let mainWrapper = wrapper.find('main')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onMouseLeave).toHaveBeenCalledTimes(0)

      // simulate trigger event
      mainWrapper.simulate('mouseenter')

      jest.runTimersToTime(400)

      // still neither should have been fired
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onMouseLeave).toHaveBeenCalledTimes(0)

      // simulate cancel event
      mainWrapper.simulate('mouseleave')

      // specific handler should've been called with composite
      // event cancelled
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onMouseLeave).toHaveBeenCalledTimes(1)

      // run past duration
      jest.runTimersToTime(100)

      // no change expected
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onMouseLeave).toHaveBeenCalledTimes(1)
    })

    it('also calls handler for event matching one of events in `cancelEvent`', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onMouseOver',
        defaultDuration: 877,
        cancelEvent: ['onClick', 'onKeyPress'],
      })
      const EnhancedSpan = withCompositeEvent()('span')

      let onCompositeEvent = jest.fn()
      let onKeyPress = jest.fn()
      let wrapper = shallow(
        <EnhancedSpan
          onKeyPress={onKeyPress}
          onCompositeEvent={onCompositeEvent}
        />
      )
      let spanWrapper = wrapper.find('span')

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onKeyPress).toHaveBeenCalledTimes(0)

      // simulate trigger event
      spanWrapper.simulate('mouseover')

      jest.runTimersToTime(400)

      // still neither should have been fired
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onKeyPress).toHaveBeenCalledTimes(0)

      // simulate cancel event
      spanWrapper.simulate('keypress')

      // specific handler should've been called with composite
      // event cancelled
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onKeyPress).toHaveBeenCalledTimes(1)

      // run past duration
      jest.runTimersToTime(500)

      // no change expected
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
      expect(onKeyPress).toHaveBeenCalledTimes(1)
    })

    it('immediately cancels composite event when `triggerEvent` & `cancelEvent` match', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onKeyPress',
        defaultDuration: 816,
        cancelEvent: 'onKeyPress',
      })
      const EnhancedSpan = withCompositeEvent()('span')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedSpan onCompositeEvent={onCompositeEvent} />
      )
      let spanWrapper = wrapper.find('span')

      // simulate trigger/cancel event
      // should immediately cancel
      spanWrapper.simulate('keypress')

      // immedately cancelled so shouldn't fire
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // run some time
      jest.runTimersToTime(400)

      // immedately cancelled so shouldn't fire
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // simulate trigger/cancel event
      // should immediately cancel
      spanWrapper.simulate('keypress')

      // immedately cancelled so shouldn't fire
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // run past first duration
      jest.runTimersToTime(450)

      // even though enough time passed for first one it was immediately cancelled
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // run past second duration
      jest.runTimersToTime(450)

      // even though enough time passed for second one it was immediately cancelled
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
    })

    it('cancels both composite events when there are 2 different ones with same `cancelEvent`', () => {
      const withCompositeEventA = compose({
        eventPropName: 'onCompositeEventA',
        triggerEvent: 'onMouseOver',
        defaultDuration: 400,
        cancelEvent: 'onMouseOut',
      })
      const withCompositeEventB = compose({
        eventPropName: 'onCompositeEventB',
        triggerEvent: 'onMouseMove',
        defaultDuration: 400,
        cancelEvent: 'onMouseOut',
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

      // simulate trigger event A
      navWrapper.simulate('mouseover')

      // both handlers shouldn't have been called
      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(0)

      // run some duration
      jest.runTimersToTime(150)

      // simulate trigger event B
      navWrapper.simulate('mousemove')

      // both handlers still shouldn't have been called
      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(0)

      // run some more duration
      jest.runTimersToTime(150)

      // simulate common cancel event
      navWrapper.simulate('mouseout')

      // both handlers still shouldn't have been called
      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(0)

      // run past duration A
      jest.runTimersToTime(150)

      // both handlers still shouldn't have been called
      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(0)

      // run past duration B
      jest.runTimersToTime(250)

      // both handlers still shouldn't have been called
      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(0)
    })

    it('calls appropariate composite event handlers even when `cancelEvent` of one matches trigger of another', () => {
      const withCompositeEventA = compose({
        eventPropName: 'onCompositeEventA',
        triggerEvent: 'onMouseOver',
        defaultDuration: 184,
        cancelEvent: 'onKeyDown',
      })
      const withCompositeEventB = compose({
        eventPropName: 'onCompositeEventB',
        triggerEvent: 'onKeyDown',
        defaultDuration: 748,
        cancelEvent: 'onFocus',
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

      // simulate trigger event A
      navWrapper.simulate('mouseover')

      // both handlers shouldn't have been called
      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(0)

      // run some duration
      jest.runTimersToTime(150)

      // both handlers still shouldn't have been called
      // A hasn't had enough duration, B hasn't triggered
      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(0)

      // simulate cancel event A / trigger event B
      navWrapper.simulate('keydown')

      // both handlers still shouldn't have been called
      // A was cancelled, B just started
      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(0)

      // run past duration A
      jest.runTimersToTime(500)

      // both handlers still shouldn't have been called
      // A still cancelled, B hasn't had enough duration
      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(0)

      // run past duration B
      jest.runTimersToTime(300)

      // As still cancelled, B did go past duration
      expect(onCompositeEventA).toHaveBeenCalledTimes(0)
      expect(onCompositeEventB).toHaveBeenCalledTimes(1)
    })
  })

  describe('`shouldResetTimerOnRetrigger` config', () => {
    it('resets timer on retrigger by default (single `triggerEvent`)', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 1000,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // fast forward some time
      jest.runTimersToTime(600)

      // retrigger dummy event
      // should also reset timer
      dummyWrapper.prop('onDummyEvent')()

      // fast forward past initial delay
      jest.runTimersToTime(600)

      // should not fire composite event because of timer reset
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // fast forward past timer reset delay
      jest.runTimersToTime(600)

      // now composite event should be fired
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('resets timer on retrigger by default (multiple `triggerEvent`)', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onDummyEventA', 'onDummyEventB', 'onDummyEventC'],
        defaultDuration: 385,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      // simulate a dummy event
      dummyWrapper.prop('onDummyEventC')()

      // fast forward some time
      jest.runTimersToTime(189)

      // trigger a different dummy event
      // should also reset timer
      dummyWrapper.prop('onDummyEventB')()

      // fast forward past initial delay
      jest.runTimersToTime(200)

      // should not fire composite event because of timer reset
      expect(onCompositeEvent).toHaveBeenCalledTimes(0)

      // fast forward past timer reset delay
      jest.runTimersToTime(300)

      // now composite event should be fired
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('ignores retrigger when flag is off (single `triggerEvent`)', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 1000,
        shouldResetTimerOnRetrigger: false,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // fast forward some time
      jest.runTimersToTime(600)

      // retrigger dummy event
      // should *not* reset timer and be ignored
      dummyWrapper.prop('onDummyEvent')()

      // fast forward past initial delay
      jest.runTimersToTime(600)

      // should fire composite event because there was no reset
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)

      // fast forward past retrigger duration
      jest.runTimersToTime(500)

      // should not be called again because it was ignored
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('ignores retrigger when flag is off (multiple `triggerEvent`)', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onDummyEventA', 'onDummyEventB', 'onDummyEventC'],
        defaultDuration: 664,
        shouldResetTimerOnRetrigger: false,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      // simulate dummy event
      dummyWrapper.prop('onDummyEventB')()

      // fast forward some time
      jest.runTimersToTime(600)

      // retrigger dummy event
      // should *not* reset timer and be ignored
      dummyWrapper.prop('onDummyEventA')()

      // fast forward past initial delay
      jest.runTimersToTime(200)

      // should fire composite event because there was no reset
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)

      // fast forward past retrigger duration
      jest.runTimersToTime(500)

      // should not be called again because it was ignored
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('calls composite event normally with flag off', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 300,
        shouldResetTimerOnRetrigger: false,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // fast forward past duration
      jest.runTimersToTime(398)

      // should fire composite event because duration passed
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('calls composite event normally with flag off & no default duration', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        shouldResetTimerOnRetrigger: false,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // should fire composite event immediately
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('still calls manual event when retriggers are ignored because flag is off', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 1000,
        shouldResetTimerOnRetrigger: false,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let onDummyEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy
          onCompositeEvent={onCompositeEvent}
          onDummyEvent={onDummyEvent}
        />
      )
      let dummyWrapper = wrapper.find(Dummy)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // manual event should've been called
      expect(onDummyEvent).toHaveBeenCalledTimes(1)

      // fast forward some time
      jest.runTimersToTime(600)

      // retrigger dummy event
      // should *not* reset timer and be ignored
      dummyWrapper.prop('onDummyEvent')()

      // manual event should've been called again
      expect(onDummyEvent).toHaveBeenCalledTimes(2)

      // fast forward past initial delay
      jest.runTimersToTime(600)

      // should fire composite event because there was no reset
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
    })

    it('retriggers composite event with flag on when duration passes', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 1000,
        shouldResetTimerOnRetrigger: true,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')()

      // fast forward past duration
      jest.runTimersToTime(1050)

      // should fire composite event because duration expired
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)

      // retrigger dummy event
      // *should* reset timer since duration had expired
      dummyWrapper.prop('onDummyEvent')()

      // should not have fired again because we have to wait for duration
      expect(onCompositeEvent).toHaveBeenCalledTimes(1)

      // fast forward past delay again
      jest.runTimersToTime(1050)

      // should fire composite event because duration expired
      expect(onCompositeEvent).toHaveBeenCalledTimes(2)

      // retrigger dummy event one more time
      // *should* reset timer since duration had expired
      dummyWrapper.prop('onDummyEvent')()

      // fast forward some time
      jest.runTimersToTime(700)

      // should not have been called again since not enough time has passed
      expect(onCompositeEvent).toHaveBeenCalledTimes(2)

      // retrigger dummy event one more time
      // should reset timer
      dummyWrapper.prop('onDummyEvent')()

      // fast forward past what would've been time expiring
      jest.runTimersToTime(400)

      // still not called again since retrigger reset timer
      expect(onCompositeEvent).toHaveBeenCalledTimes(2)

      // fast forward past timer reset duration
      jest.runTimersToTime(600)

      // finally third fire happens
      expect(onCompositeEvent).toHaveBeenCalledTimes(3)
    })
  })

  describe('`beforeHandle` config', () => {
    it('calls the function w/ handler & event object when `defaultDuration` is not specified', () => {
      let beforeHandle = jest.fn()
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        beforeHandle,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)
      let fakeEventObject = {}

      expect(beforeHandle).toHaveBeenCalledTimes(0)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')(fakeEventObject)

      expect(beforeHandle).toHaveBeenCalledTimes(1)
      expect(beforeHandle).toHaveBeenCalledWith(
        onCompositeEvent,
        fakeEventObject
      )
    })

    it('calls the function when `defaultDuration` is specified', () => {
      let beforeHandle = jest.fn()
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: 'onDummyEvent',
        defaultDuration: 800,
        beforeHandle,
      })
      const EnhancedDummy = withCompositeEvent()(Dummy)

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(
        <EnhancedDummy onCompositeEvent={onCompositeEvent} />
      )
      let dummyWrapper = wrapper.find(Dummy)
      let fakeEventObject = {}

      expect(beforeHandle).toHaveBeenCalledTimes(0)

      // simulate dummy event
      dummyWrapper.prop('onDummyEvent')(fakeEventObject)

      // still shouldn't be called because no time has passed
      expect(beforeHandle).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(400)

      // still shouldn't be called because delay hasn't fully passed
      expect(beforeHandle).toHaveBeenCalledTimes(0)

      jest.runTimersToTime(500)

      // should've been called by now
      expect(beforeHandle).toHaveBeenCalledTimes(1)
      expect(beforeHandle).toHaveBeenCalledWith(
        onCompositeEvent,
        fakeEventObject
      )
    })

    it('calls handler with trigger event object when function returns `true`', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onKeyDown', 'onKeyUp'],
        beforeHandle: () => true,
      })
      const EnhancedNav = withCompositeEvent()('nav')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(<EnhancedNav onCompositeEvent={onCompositeEvent} />)
      let navWrapper = wrapper.find('nav')
      let fakeEventObject = {}

      // simulate trigger event
      navWrapper.simulate('keydown', fakeEventObject)

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent).toHaveBeenCalledWith(fakeEventObject)
    })

    it('does not call handler when function returns `false`', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onKeyDown', 'onKeyUp'],
        beforeHandle: () => false,
      })
      const EnhancedNav = withCompositeEvent()('nav')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(<EnhancedNav onCompositeEvent={onCompositeEvent} />)
      let navWrapper = wrapper.find('nav')
      let fakeEventObject = {}

      // simulate trigger event
      navWrapper.simulate('keyup', fakeEventObject)

      expect(onCompositeEvent).toHaveBeenCalledTimes(0)
    })

    it('calls the handler only once when function returns `undefined` and calls handler explicitly', () => {
      const withCompositeEvent = compose({
        eventPropName: 'onCompositeEvent',
        triggerEvent: ['onKeyDown', 'onKeyUp'],
        beforeHandle: (handler, event) => {
          handler(event)
        },
      })
      const EnhancedNav = withCompositeEvent()('nav')

      let onCompositeEvent = jest.fn()
      let wrapper = shallow(<EnhancedNav onCompositeEvent={onCompositeEvent} />)
      let navWrapper = wrapper.find('nav')
      let fakeEventObject = {}

      // simulate trigger event
      navWrapper.simulate('keydown', fakeEventObject)

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent).toHaveBeenCalledWith(fakeEventObject)
    })
  })
})
