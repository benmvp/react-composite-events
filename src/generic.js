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
