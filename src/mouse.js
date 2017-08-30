// @flow
import compose from './compose'

export const withMouseRest = compose({
  eventPropName: 'onMouseRest',
  triggerEvent: ['onMouseOver', 'onMouseMove'],
  defaultDuration: 500,
  cancelEvent: ['onMouseOut', 'onMouseDown'],
})

export const withMouseRemainOver = compose({
  eventPropName: 'onMouseRemainOver',
  triggerEvent: ['onMouseOver', 'onMouseMove'],
  defaultDuration: 500,
  // including `onMouseDown` because clicking is basically a different action
  cancelEvent: ['onMouseOut', 'onMouseDown'],
  // as long as the mouse is over, moving around doesn't matter
  shouldResetTimerOnRetrigger: false,
})

export const withMouseRemainOut = compose({
  eventPropName: 'onMouseRemainOut',
  triggerEvent: 'onMouseOut',
  defaultDuration: 500,
  cancelEvent: 'onMouseOver',
})
