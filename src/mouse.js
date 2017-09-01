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

type MouseModifierKeySettings = {
  eventPropName: string,
  mouseEvent: string,
  alt?: boolean,
  ctrl?: boolean,
  meta?: boolean,
  shift?: boolean,
}

export const composeMouseModifierKey = ({
  eventPropName,
  mouseEvent,
  alt = false,
  ctrl = false,
  meta = false,
  shift = false,
}: MouseModifierKeySettings) =>
  compose({
    eventPropName,
    triggerEvent: mouseEvent,
    beforeHandle: (handler, e?: SyntheticEvent<>) => {
      let syntheticMouseEvent = ((e: any): SyntheticMouseEvent<>)

      return (
        syntheticMouseEvent &&
        syntheticMouseEvent.altKey === alt &&
        syntheticMouseEvent.ctrlKey === ctrl &&
        syntheticMouseEvent.metaKey === meta &&
        syntheticMouseEvent.shiftKey === shift
      )
    },
  })

export const withOnlyClick = composeMouseModifierKey({
  eventPropName: 'onOnlyClick',
  mouseEvent: 'onClick',
})

export const withAltClick = composeMouseModifierKey({
  eventPropName: 'onAltClick',
  mouseEvent: 'onClick',
  alt: true,
})

export const withCtrlClick = composeMouseModifierKey({
  eventPropName: 'onCtrlClick',
  mouseEvent: 'onClick',
  ctrl: true,
})

export const withMetaClick = composeMouseModifierKey({
  eventPropName: 'onMetaClick',
  mouseEvent: 'onClick',
  meta: true,
})

export const withShiftClick = composeMouseModifierKey({
  eventPropName: 'onShiftClick',
  mouseEvent: 'onClick',
  shift: true,
})
