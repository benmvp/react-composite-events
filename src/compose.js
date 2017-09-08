// @flow
import React, {Component} from 'react'
import type {ElementType, ComponentType} from 'react'
import {getDisplayName} from './utils'

export type EventName = string
type TimerEvent = EventName | EventName[]
type EventHandler = (event?: SyntheticEvent<>) => void
type CompositeEventHandler = EventHandler
type ComposerSettings = {
  eventPropName: EventName,
  triggerEvent: TimerEvent,
  defaultDuration?: number,
  cancelEvent?: TimerEvent,
  shouldResetTimerOnRetrigger?: boolean,
  beforeHandle?: (
    handler: CompositeEventHandler,
    event?: SyntheticEvent<>
  ) => boolean | void,
}
type InternalHandler = (eventName: EventName, event?: SyntheticEvent<>) => void

const _omit = (props: {}, propToOmit: string): {} => {
  let propsCopy = {...props}

  delete propsCopy[propToOmit]

  return propsCopy
}

const _eventNamesToHandlerLookup = (
  eventNames?: EventName[],
  handler: InternalHandler
): {[EventName]: InternalHandler} =>
  (eventNames || []).reduce(
    (lookup, eventName) => ({
      ...lookup,
      [eventName]: handler.bind(null, eventName),
    }),
    {}
  )
const _isValidDuration = (duration: number): boolean => duration > 0

export default ({
  eventPropName,
  triggerEvent,
  defaultDuration = 0,
  cancelEvent,
  shouldResetTimerOnRetrigger = true,
  beforeHandle = () => true,
}: ComposerSettings) => {
  // istanbul ignore next
  if (process.env.NODE_ENV !== 'production') {
    if (!eventPropName) {
      throw new Error('`eventPropName` configuration must be specified')
    }
    if (!triggerEvent) {
      throw new Error('`triggerEvent` configuration must be specified')
    }
  }

  let triggerEvents = Array.isArray(triggerEvent)
    ? triggerEvent
    : [triggerEvent]
  let cancelEvents

  if (cancelEvent) {
    cancelEvents = Array.isArray(cancelEvent) ? cancelEvent : [cancelEvent]
  }

  return (duration?: number = 0) => {
    let timeoutDuration = defaultDuration
    let durationSuffix = ''

    // if defaultDuration is specified and there's a duration override,
    // use the override. Otherwise there's no timeout happening
    if (_isValidDuration(defaultDuration) && _isValidDuration(duration)) {
      timeoutDuration = duration
      durationSuffix = `-${duration}`
    }

    // if the duration is passed the composite even prop name needs to be parameterized
    let compositeEventPropName = `${eventPropName}${durationSuffix}`

    return (Element: ElementType): ComponentType<{}> => {
      if (!Element && process.env.NODE_ENV !== 'production') {
        throw new Error('Component/element to enhance must be specified')
      }

      let elementDisplayName = getDisplayName(Element)

      return class CompositeEventWrapper extends Component<{}> {
        static displayName = `${elementDisplayName}-${eventPropName}${durationSuffix}`

        _delayTimeout = null

        _callSpecificHandler = (eventName: EventName, e?: SyntheticEvent<>) => {
          let onEvent: EventHandler = this.props[eventName]

          if (onEvent) {
            onEvent(e)
          }
        }

        _clearTimeout = () => {
          this._delayTimeout = clearTimeout(this._delayTimeout)
        }

        _callCompositeEvent = (e?: SyntheticEvent<>) => {
          let onCompositeEvent: CompositeEventHandler = this.props[
            compositeEventPropName
          ]

          // If a before handle function is defined, call it and check to see what the function returns
          // truthy - means that it wants the HOC to to call the final handler with the event object
          // falsy - means that it doesn't want the HOC to do anything
          // The function receives the composite event handler + event object to make it's decision and
          // can call the handler directly
          if (beforeHandle(onCompositeEvent, e)) {
            onCompositeEvent(e)
          }
        }

        _handleTriggerEvent = (eventName: EventName, e?: SyntheticEvent<>) => {
          let onCompositeEvent: CompositeEventHandler = this.props[
            compositeEventPropName
          ]

          // If a specific handler was passed, call that one first
          this._callSpecificHandler(eventName, e)

          if (!onCompositeEvent) {
            // istanbul ignore next
            if (process.env.NODE_ENV !== 'production') {
              // eslint-disable-next-line no-console
              console.warn(
                `No handler was found for \`${compositeEventPropName}\` in \`<${elementDisplayName} />\`! Was this a typo? If not, you should consider avoiding using the composite event HOC to improve performance`
              )
            }

            return
          }

          // Call the composite event handler
          if (_isValidDuration(timeoutDuration)) {
            // If shouldResetTimerOnRetrigger flag is not explicitly turned off, we need to
            // clear any existing timeout and start a fresh timer because a retrigger happened.
            if (shouldResetTimerOnRetrigger !== false) {
              this._clearTimeout()
            }

            // And we can start a timeout as long as we don't have an active one going
            if (!this._delayTimeout) {
              this._delayTimeout = setTimeout(
                () => this._callCompositeEvent(e),
                timeoutDuration
              )
            }
          } else {
            this._callCompositeEvent(e)
          }
        }

        _handleCancelEvent = (eventName: EventName, e?: SyntheticEvent<>) => {
          // If a specific handler was passed, call that one first
          this._callSpecificHandler(eventName, e)

          // just cancel the timeout so composite handler won't be called
          this._clearTimeout()
        }

        render() {
          // Want to pass all the props through to the underlying Component except the passed
          // compositeEventPropName, which we need to handle specially.
          // This will also include separate specific handlers matching trigger & cancel events
          let passThruProps = _omit(this.props, compositeEventPropName)

          // Create an object mapping of the trigger/cancel events to handlers.
          // The handler needs to bind the event name so that we can check to see if
          // a specific handler was specified so we can fire that too
          let triggerEventHandlers = _eventNamesToHandlerLookup(
            triggerEvents,
            this._handleTriggerEvent
          )
          let cancelEventHandlers = _eventNamesToHandlerLookup(
            cancelEvents,
            this._handleCancelEvent
          )

          // As a result of cancelEventHandlers going after triggerEventHandlers below, if
          // a cancel event matches a trigger event, the composite event will never be triggered

          return (
            <Element
              {...passThruProps}
              {...triggerEventHandlers}
              {...cancelEventHandlers}
            />
          )
        }
      }
    }
  }
}
