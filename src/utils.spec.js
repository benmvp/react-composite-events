// @flow
import React, {PureComponent} from 'react'
import {getDisplayName} from './utils'

describe('`getDisplayName`', () => {
  it('return the the element name when passed a JSX element', () => {
    expect(getDisplayName('a')).toBe('a')
  })

  it('returns the `displayName` static property of a component class', () => {
    class MyComponent extends PureComponent<{}> {
      static displayName = 'Foo'

      render() {
        return <div />
      }
    }

    expect(getDisplayName(MyComponent)).toBe('Foo')
  })

  it('returns the name of a component class (no static `displayName`)', () => {
    // eslint-disable-next-line react/no-multi-comp
    class MyComponent extends PureComponent<{}> {
      render() {
        return <span />
      }
    }

    expect(getDisplayName(MyComponent)).toBe('MyComponent')
  })

  it('return the name of stateless function', () => {
    const MyComponent = () => <div />

    expect(getDisplayName(MyComponent)).toBe('MyComponent')
  })

  it('return "WrapperComponent" for an unrecognized component type', () => {
    // $FlowIgnore: error handling test case
    expect(getDisplayName({})).toBe('WrapperComponent')
  })
})
