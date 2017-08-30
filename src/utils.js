// @flow
import type {ElementType} from 'react'

export const getDisplayName = (Element: ElementType): string => {
  if (typeof Element === 'string') {
    return Element
  }

  // $FlowFixMe: Need to figure out how to properly validate that Element is a class component to get `displayName` statically
  return Element.displayName || Element.name || 'WrapperComponent'
}
