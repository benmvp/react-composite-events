import compose from './compose'

export const withLongPress = compose({
  eventPropName: 'onLongPress',
  triggerEvent: ['onMouseDown', 'onPressIn'],
  defaultDuration: 1250,
  cancelEvent: ['onMouseUp', 'onMouseOut', 'onPressOut'],
})

export const withRemainReleased = compose({
  eventPropName: 'onRemainReleased',
  triggerEvent: ['onMouseUp', 'onPressOut'],
  defaultDuration: 500,
  cancelEvent: ['onMouseDown', 'onPressIn'],
})

export const withRemainFocused = compose({
  eventPropName: 'onRemainFocused',
  triggerEvent: 'onFocus',
  defaultDuration: 500,
  cancelEvent: 'onBlur',
})

export const withRemainBlurred = compose({
  eventPropName: 'onRemainBlurred',
  triggerEvent: 'onBlur',
  defaultDuration: 500,
  cancelEvent: 'onFocus',
})
