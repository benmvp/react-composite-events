/* eslint-disable no-empty-function */
import React from 'react'
import {shallow} from 'enzyme'
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

      // 1. simulate trigger event
      navWrapper.simulate('keydown', fakeEventObject)

      expect(onCompositeEvent).toHaveBeenCalledTimes(1)
      expect(onCompositeEvent).toHaveBeenCalledWith(fakeEventObject)
    })
  })

  describe('`defaultDuration` config', () => {
    // TODO: test passing and not passing duration param
    // TODO: ensure composite event doesn't get fired before time expires
  })

  describe('`cancelEvent` config', () => {
    // TODO: ensure specific handlers matching cancel events are also called
  })

  describe('`shouldResetTimerOnRetrigger` config', () => {})

  describe('`defaultDuration` config', () => {})

  describe('`allowRefire` config', () => {})

  describe('`beforeCallback` config', () => {})
})
