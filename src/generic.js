import compose from './compose'

export const withLongPress = compose({
  eventPropName: 'onLongPress',
  triggerEvent: ['onMouseDown', 'onPressIn'],
  defaultDuration: 1250,
  cancelEvent: ['onMouseUp', 'onMouseOut', 'onPressOut'],
})
