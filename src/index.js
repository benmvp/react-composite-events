import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import toLookup from 'array-to-lookup'
import omit from 'lodash.omit'

const _eventNamesToHandlerLookup = (eventNames, handler) =>
  (eventNames || []).reduce(
    (lookup, eventName) => ({
      ...lookup,
      [eventName]: handler.bind(null, eventName),
    }),
    {}
  )
const _isValidDuration = (duration) => duration > 0

export const compose = ({
  eventPropName,
  triggerEvent,
  defaultDuration = 0,
  cancelEvent,
  shouldResetTimerOnRetrigger = true,
  // allowRefire = true,
  // beforeCallback,
}) => {
  if (!eventPropName) {
    throw new Error('`eventPropName` configuration must be specified')
  }
  if (!triggerEvent) {
    throw new Error('`triggerEvent` configuration must be specified')
  }

  let triggerEvents = Array.isArray(triggerEvent)
    ? triggerEvent
    : [triggerEvent]
  let cancelEvents =
    !cancelEvent || Array.isArray(cancelEvent) ? cancelEvent : [cancelEvent]

  return (duration) => {
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

    return (Component) => {
      if (!Component) {
        throw new Error('Component to enhance must be specified')
      }

      let componentDisplayName =
        Component.displayName || Component.name || Component

      return class extends PureComponent {
        static displayName = `${componentDisplayName}-${eventPropName}${durationSuffix}`

        // Defining the known prop types that *could* be passed
        // * the composite event (most likely)
        // * an event matching the trigger events
        // * an event matching the cancel events
        static propTypes = {
          ...toLookup(triggerEvents, PropTypes.func),
          ...toLookup(cancelEvents, PropTypes.func),
          [compositeEventPropName]: PropTypes.func,
        }

        _delayTimeout = null

        _callSpecificHandler = (eventName, e) => {
          let onEvent = this.props[eventName]

          if (onEvent) {
            onEvent(e)
          }
        }

        _handleTriggerEvent = (eventName, e) => {
          let onCompositeEvent = this.props[compositeEventPropName]

          // If a specific handler was passed, call that one first
          this._callSpecificHandler(eventName, e)

          // If no composite event handler was passed in, we can
          // quit early
          if (!onCompositeEvent) {
            return
          }

          // Call the composite event handler
          if (_isValidDuration(timeoutDuration)) {
            // If this is the first time the trigger event for the composite event
            // has been called (i.e. no timeout) OR the shouldResetTimerOnRetrigger
            // flag is on, we need to clear any existing timeout and start a fresh
            // timer.
            // In the case where the flag is off and we've got an active timer,
            // we'll do nothing
            if (!this._delayTimeout || shouldResetTimerOnRetrigger) {
              clearTimeout(this._delayTimeout)

              this._delayTimeout = setTimeout(
                () => onCompositeEvent(e),
                timeoutDuration
              )
            }
          } else {
            onCompositeEvent(e)
          }
        }

        _handleCancelEvent = (eventName, e) => {
          // If a specific handler was passed, call that one first
          this._callSpecificHandler(eventName, e)

          // just cancel the timeout so composite handler won't be called
          clearTimeout(this._delayTimeout)
        }

        render() {
          // Want to pass all the props through to the underlying Component except the passed
          // compositeEventPropName, which we need to handle specially.
          // This will also include separate specific handlers matching trigger & cancel events
          let passThruProps = omit(this.props, [compositeEventPropName])

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
            <Component
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
