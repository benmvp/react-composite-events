// @flow
import compose from './compose'
import type {EventName} from './compose'

type EdgeLocation = 'left' | 'right' | 'top' | 'bottom'
type EdgeDirection = 'enter' | 'leave'

type MouseEdgeSettings = {
  eventPropName: EventName,
  direction: EdgeDirection,
  location: EdgeLocation,
}

type MouseModifierKeySettings = {
  eventPropName: EventName,
  mouseEvent: EventName,
  alt?: boolean,
  ctrl?: boolean,
  meta?: boolean,
  shift?: boolean,
}

const composeMouseEdge = ({
  eventPropName,
  direction,
  location,
}: MouseEdgeSettings) =>
  compose({
    eventPropName,
    triggerEvent: direction === 'enter' ? 'onMouseEnter' : 'onMouseLeave',
    beforeHandle: (handler, e?: SyntheticEvent<>) => {
      if (!e) {
        return false
      }

      let {screenX, screenY, currentTarget} = ((e: any): SyntheticMouseEvent<>)

      if (!(currentTarget instanceof HTMLElement)) {
        return false
      }

      let {top, left, bottom, right} = currentTarget.getBoundingClientRect()

      return (
        (location === 'left' && screenX <= left) ||
        (location === 'right' && screenX >= right) ||
        (location === 'top' && screenY <= top) ||
        (location === 'bottom' && screenY >= bottom)
      )
    },
  })

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

export const withMouseEnterLeft = composeMouseEdge({
  eventPropName: 'onMouseEnterLeft',
  direction: 'enter',
  location: 'left',
})

export const withMouseEnterRight = composeMouseEdge({
  eventPropName: 'onMouseEnterRight',
  direction: 'enter',
  location: 'right',
})

export const withMouseEnterTop = composeMouseEdge({
  eventPropName: 'onMouseEnterTop',
  direction: 'enter',
  location: 'top',
})

export const withMouseEnterBottom = composeMouseEdge({
  eventPropName: 'onMouseEnterBottom',
  direction: 'enter',
  location: 'bottom',
})

export const withMouseLeaveLeft = composeMouseEdge({
  eventPropName: 'onMouseLeaveLeft',
  direction: 'leave',
  location: 'left',
})

export const withMouseLeaveRight = composeMouseEdge({
  eventPropName: 'onMouseLeaveRight',
  direction: 'leave',
  location: 'right',
})

export const withMouseLeaveTop = composeMouseEdge({
  eventPropName: 'onMouseLeaveTop',
  direction: 'leave',
  location: 'top',
})

export const withMouseLeaveBottom = composeMouseEdge({
  eventPropName: 'onMouseLeaveBottom',
  direction: 'leave',
  location: 'bottom',
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
