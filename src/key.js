import compose from './compose'

export const withKeyRemainDown = compose({
  eventPropName: 'onKeyRemainDown',
  triggerEvent: 'onKeyDown',
  defaultDuration: 500,
  cancelEvent: 'onKeyUp',
})

export const withKeyRemainUp = compose({
  eventPropName: 'onKeyRemainUp',
  triggerEvent: 'onKeyUp',
  defaultDuration: 500,
  cancelEvent: 'onKeyDown',
})
