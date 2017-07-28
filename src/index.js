import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import toLookup from 'array-to-lookup'
import omit from 'lodash.omit'

const _eventNamesToHandlerLookup = (eventNames, handler) =>
  eventNames.reduce(
    (lookup, eventName) => ({
      ...lookup,
      [eventName]: handler.bind(null, eventName),
    }),
    {}
  )

export const compose = ({
  eventPropName,
  triggerEvent,
  // defaultDuration = 0,
  cancelEvent,
  // shouldResetTimerOnRetrigger = true,
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
  let cancelEvents = Array.isArray(cancelEvent) ? cancelEvent : [cancelEvent]

  return (duration) => {
    // if the duration is passed the composite even prop name needs to be parameterized
    let compositeEventPropName =
      eventPropName + (duration ? `-${duration}` : '')

    return (Component) => {
      let componentDisplayName =
        Component.displayName || Component.name || 'Component'

      return class extends PureComponent {
        static displayName = `${componentDisplayName}WithCompositeEvent`

        // Defining the known prop types that *could* be passed
        // * the composite event (most likely)
        // * an event matching the trigger events
        // * an event matching the cancel events
        static propTypes = {
          ...toLookup(triggerEvents, PropTypes.func),
          ...toLookup(cancelEvents, PropTypes.func),
          [compositeEventPropName]: PropTypes.func,
        }

        _handleTriggerEvent = (eventName, e) => {
          let onEvent = this.props[eventName]
          let onCompositeEvent = this.props[compositeEventPropName]

          // If a specific handler was passed, call that one first
          if (onEvent) {
            onEvent(e)
          }

          // Call the composite event handler
          if (onCompositeEvent) {
            onCompositeEvent(e)
          }
        }

        render() {
          // Want to pass all the props through to the underlying Component except the passed
          // compositeEventPropName, which we need to handle specially.
          // This will also include separate specific handlers matching trigger & cancel events
          let passThruProps = omit(this.props, [compositeEventPropName])

          // Create an object mapping of the trigger events to handlers.
          // The handler needs to bind the trigger event name so that we can check to see if
          // a specific handler was specify so we can fire that too
          let triggerEventHandlers = _eventNamesToHandlerLookup(
            triggerEvents,
            this._handleTriggerEvent
          )

          return <Component {...passThruProps} {...triggerEventHandlers} />
        }
      }
    }
  }
}
