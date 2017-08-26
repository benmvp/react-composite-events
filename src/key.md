# Key APIs

The following collection of APIs apply primarily to DOM components that handle key-related events. Those that depend on DOM key events are indicated as such.

## ToC

- [Higher-order components](#higher-order-components)
  - [`withKeyRemainDown()`](#withkeyremaindown)
  - [`withKeyRemainUp()`](#withkeyremainup)
  - [`withKeyPress()`](#withkeypress)
  - [`withKeyDown()`](#withkeydown)

## Higher-order components

### `withKeyRemainDown()`

```js
withKeyRemainDown
  duration?: integer = 500
): HigherOrderComponent
```

Creates an HOC for a composite event (named `onKeyRemainDown-*`) that is triggered when the user presses down on a key on the keyboard for a focused component that supports key events, and then continues to hold down that key for a specified duration of time.

```js
import {withKeyRemainDown} from 'react-composite-events'
// or
import {withKeyRemainDown} from 'react-composite-events/key'

const EnhancedTextarea = withKeyRemainDown(200)('textarea')

export default MyComponent extends PureComponent {
  _handleKeyRemainDown(e) {
    console.log(`200ms with ${e.key} key remaining down!`);
  }

  render() {
    return (
      <EnhancedTextarea onKeyRemainDown-200={this._handleKeyRemainDown.bind(this)} />
    )
  }
}
```

When no `duration` parameter is specified, then the value for this parameter is defaulted to `500` (500 milliseconds). In this case the composite event prop is simply `onKeyRemainDown`.

```js
import {withKeyRemainDown} from 'react-composite-events'
// or
import {withKeyRemainDown} from 'react-composite-events/key'

const EnhancedTextarea = withKeyRemainDown()('textarea')

export default MyComponent extends PureComponent {
  _handleKeyRemainDown(e) {
    console.log(`default key remained down: ${e.key}!`);
  }

  render() {
    return (
      <EnhancedTextarea onKeyRemainDown={this._handleKeyRemainDown.bind(this)} />
    )
  }
}
```

> `withKeyRemainDown` adds handlers for `onKeyDown` & `onKeyUp` to build the `onKeyRemainDown` composite event. The handler for `onKeyRemainDown` will receive the event object for `onKeyDown`, if it exists.

See related [`withKeyRemainUp()`](#withkeyremainup).


### `withKeyRemainUp()`

```js
withKeyRemainUp
  duration?: integer = 500
): HigherOrderComponent
```

Creates an HOC for a composite event (named `onKeyRemainUp-*`) that is triggered when the user release a key on the keyboard for a focused component that supports key events, and doesn't press down on a key again for a specified duration of time.

```js
import {withKeyRemainUp} from 'react-composite-events'
// or
import {withKeyRemainUp} from 'react-composite-events/key'

const EnhancedTextarea = withKeyRemainUp(200)('textarea')

export default MyComponent extends PureComponent {
  _handleKeyRemainUp(e) {
    console.log(`200ms with ${e.key} key remaining up!`);
  }

  render() {
    return (
      <EnhancedTextarea onKeyRemainUp-200={this._handleKeyRemainUp.bind(this)} />
    )
  }
}
```

When no `duration` parameter is specified, then the value for this parameter is defaulted to `500` (500 milliseconds). In this case the composite event prop is simply `onKeyRemainUp`.

```js
import {withKeyRemainUp} from 'react-composite-events'
// or
import {withKeyRemainUp} from 'react-composite-events/key'

const EnhancedTextarea = withKeyRemainUp()('textarea')

export default MyComponent extends PureComponent {
  _handleKeyRemainUp(e) {
    console.log(`default key remained up: ${e.key}!`);
  }

  render() {
    return (
      <EnhancedTextarea onKeyRemainUp={this._handleKeyRemainUp.bind(this)} />
    )
  }
}
```

> `withKeyRemainUp` adds handlers for `onKeyUp` & `onKeyDown` to build the `onKeyRemainUp` composite event. The handler for `onKeyRemainUp` will receive the event object for `onKeyUp`, if it exists.

See related [`withKeyRemainDown()`](#withkeyremaindown).



### `withKeyPress()`

Coming soon...



### `withKeyDown()`

Coming soon...
