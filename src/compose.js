import React, {PureComponent} from 'react'

const _omit = (props, propToOmit) => {
  let propsCopy = {...props}

  delete propsCopy[propToOmit]

  return propsCopy
}

const _eventNamesToHandlerLookup = (eventNames, handler) =>
  (eventNames || []).reduce(
    (lookup, eventName) => ({
      ...lookup,
      [eventName]: handler.bind(null, eventName),
    }),
    {}
  )
const _isValidDuration = (duration) => duration > 0

export default ({
  eventPropName,
  triggerEvent,
  defaultDuration = 0,
  cancelEvent,
  shouldResetTimerOnRetrigger = true,
  beforeHandle = () => true,
}) => {
  if (process.env.NODE_ENV !== 'production' && !eventPropName) {
    throw new Error('`eventPropName` configuration must be specified')
  }
  if (process.env.NODE_ENV !== 'production' && !triggerEvent) {
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
      if (process.env.NODE_ENV !== 'production' && !Component) {
        throw new Error('Component to enhance must be specified')
      }

      let componentDisplayName =
        Component.displayName || Component.name || Component

      return class extends PureComponent {
        static displayName = `${componentDisplayName}-${eventPropName}${durationSuffix}`

        _delayTimeout = null

        _callSpecificHandler = (eventName, e) => {
          let onEvent = this.props[eventName]

          if (onEvent) {
            onEvent(e)
          }
        }

        _clearTimeout = () => {
          this._delayTimeout = clearTimeout(this._delayTimeout)
        }

        _callCompositeEvent = (e) => {
          let onCompositeEvent = this.props[compositeEventPropName]

          // If a before handle function is defined, call it and check to see what the function returns
          // truthy - means that it wants the HOC to to call the final handler with the event object
          // falsy - means that it doesn't want the HOC to do anything
          // The function receives the composite event handler + event object to make it's decision and
          // can call the handler directly
          if (beforeHandle(onCompositeEvent, e)) {
            onCompositeEvent(e)
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

        _handleCancelEvent = (eventName, e) => {
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
