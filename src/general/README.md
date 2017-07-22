# General APIs

The following collection of general composite event APIs that are intended to be environment-agnostic. They should also be able to run in React Native and other non-DOM environments.

## ToC

- [Higher-order components](#higher-order-components)
  - [`withLongPress()`](#withlongpress)
  - [`withRemainReleased()`](#withremainreleased)
  - [`withRemainFocused()`](#withremainfocused)
  - [`withRemainBlurred()`](#withremainblurred)
  - [`withFirstPress()`](#withfirstpress)
  - [`withRepeatPress()`](#withrepeatpress)
- [HOC Composers](#hoc-composers)
  - [`composeFirst()`](#composefirst)
  - [`composeRepeat()`](#composerepeat)

## Higher-order components

### `withLongPress()`

```js
withLongPress
  ?duration: integer = 1250
): HigherOrderComponent
```

Creates an HOC for a composite event (named `onLongPress-*`) that is triggered when a user presses down on a component and doesn't release from that component or move out of it for a specified duration of time.

```js
import {withLongPress} from 'react-composite-events/general'

const EnhancedTO = withLongPress(750)(TouchableOpacity)

export default MyComponent extends PureComponent {
  _handleLongPress(e) {
    e.preventDefault;
    console.log('750ms long press!');
  }

  render() {
    return (
      <EnhancedTO onLongPress-750={this._handleLongPress.bind(this)}>
        <Text>Long press me</Text>
      </EnhancedTO>
    )
  }
}
```

When no `duration` parameter is specified, then the value for this parameter is defaulted to `1250` (1.25 seconds). In this case the composite event prop is simply `onLongPress`.

```js
import {withLongPress} from 'react-composite-events/general'

const EnhancedAnchor = withLongPress()('a')

export default MyComponent extends PureComponent {
  _handleLongPress(e) {
    e.preventDefault();
    console.log('default long press!');
  }

  render() {
    return (
      <EnhancedAnchor
        href="http://www.benmvp.com/"
        onLongPress={this._handleLongPress.bind(this)}
      >
        Long press me
      </EnhancedAnchor>
    )
  }
}
```

> `withLongPress` adds handlers for `onMouseDown`/`onMouseUp`/`onMouseOut` or `onPressIn`/`onPressOut` to build the `onLongPress` composite event. The handler for `onLongPress` will receive the event object for `onMouseDown` or `onPressIn`, if it exists.

See related [`withRemainReleased()`](#withremainreleased).



### `withRemainReleased()`

```js
withRemainReleased
  ?duration: integer = 500
): HigherOrderComponent
```

Creates an HOC for a composite event (named `onRemainReleased-*`) that is triggered when a user releases a component (after pressing it) and doesn't press that component again for a specified duration of time.

```js
import {withRemainReleased} from 'react-composite-events/general'

const EnhancedTO = withRemainReleased(250)(TouchableOpacity)

export default MyComponent extends PureComponent {
  _handleRemainReleased() {
    console.log('250ms after release!');
  }

  render() {
    return (
      <EnhancedTO onRemainReleased-250={this._handleRemainReleased.bind(this)}>
        <Text>Release me</Text>
      </EnhancedTO>
    )
  }
}
```

When no `duration` parameter is specified, then the value for this parameter is defaulted to `500` (500 milliseconds). In this case the composite event prop is simply `onRemainReleased`.

```js
import {withRemainReleased} from 'react-composite-events/general'

const EnhancedTO = withRemainReleased()(TouchableOpacity)

export default MyComponent extends PureComponent {
  _handleRemainReleased() {
    console.log('default remain released!');
  }

  render() {
    return (
      <EnhancedTO onRemainReleased={this._handleRemainReleased.bind(this)}>
        <Text>Release me</Text>
      </EnhancedTO>
    )
  }
}
```

> `withRemainReleased` adds handlers for `onMouseDown`/`onMouseUp` or `onPressIn`/`onPressOut` to build the `onRemainReleased` composite event. The handler for `onRemainReleased` will receive the event object for `onMouseUp` or `onPressOut`, if it exists.

See related [`withLongPress()`](#withlongpress).



### `withRemainFocused()`

```js
withRemainFocused
  ?duration: integer = 500
): HigherOrderComponent
```

Creates an HOC for a composite event (named `onRemainFocused-*`) that is triggered when a component stays focused for a specified duration of time.

```js
import {withRemainFocused} from 'react-composite-events/general'

const EnhancedTI = withRemainFocused(1000)(TextInput)

export default MyComponent extends PureComponent {
  _handleRemainFocused() {
    console.log('1s after focus!');
  }

  render() {
    return (
      <EnhancedTI onRemainFocused-1000={this._handleRemainFocused.bind(this)} />
    )
  }
}
```

When no `duration` parameter is specified, then the value for this parameter is defaulted to `500` (500 milliseconds). In this case the composite event prop is simply `onRemainFocused`.

```js
import {withRemainFocused} from 'react-composite-events/general'

const EnhancedTI = withRemainFocused()(TouchableOpacity)

export default MyComponent extends PureComponent {
  _handleRemainFocused() {
    console.log('default remain focused!');
  }

  render() {
    return (
      <EnhancedTI onRemainFocused={this._handleRemainFocused.bind(this)} />
    )
  }
}
```

> `withRemainFocused` adds handlers for `onFocus` & `onBlur` to build the `onRemainFocused` composite event. The handler for `onRemainFocused` will receive the event object for `onFocus`, if it exists.

See related [`withRemainBlurred()`](#withremainblurred).



### `withRemainBlurred()`

```js
withRemainBlurred
  ?duration: integer = 500
): HigherOrderComponent
```

Creates an HOC for a composite event (named `onRemainBlurred-*`) that is triggered when a component stays blurred / unfocused for a specified duration of time.

```js
import {withRemainBlurred} from 'react-composite-events/general'

const EnhancedTI = withRemainBlurred(350)(TextInput)

export default MyComponent extends PureComponent {
  _handleRemainBlurred() {
    console.log('350ms after blur!');
  }

  render() {
    return (
      <EnhancedTI onRemainBlurred-350={this._handleRemainBlurred.bind(this)} />
    )
  }
}
```

When no `duration` parameter is specified, then the value for this parameter is defaulted to `500` (500 milliseconds). In this case the composite event prop is simply `onRemainBlurred`.

```js
import {withRemainBlurred} from 'react-composite-events/general'

const EnhancedTI = withRemainBlurred()(TouchableOpacity)

export default MyComponent extends PureComponent {
  _handleRemainBlurred() {
    console.log('default remain blurred!');
  }

  render() {
    return (
      <EnhancedTI onRemainBlurred={this._handleRemainBlurred.bind(this)} />
    )
  }
}
```

> `withRemainBlurred` adds handlers for `onFocus` & `onBlur` to build the `onRemainBlurred` composite event. The handler for `onRemainBlurred` will receive the event object for `onBlur`, if it exists.

See related [`withRemainFocused()`](#withremainfocused).



### `withFirstPress()`

Coming soon...



### `withRepeatPress()`

Coming soon...



## HOC Composers

### `composeFirst()`

Coming soon...



### `composeRepeat()`

Coming soon...
