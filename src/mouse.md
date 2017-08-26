# Mouse APIs

The following collection of APIs apply primarily to components that handle mouse-related events. Those that depend on DOM mouse events are indicated as such.

## ToC

- [Higher-order components](#higher-order-components)
  - [`withMouseRest()`](#withmouserest)
  - [`withMouseRemainOut()`](#withmouseremainout)
  - [`withMouseRemainOver()`](#withmouseremainover)
  - [`withMouseEnterLeft()`](#withmouseenterleft)
  - [`withMouseEnterRight()`](#withmouseenterright)
  - [`withMouseEnterTop()`](#withmouseentertop)
  - [`withMouseEnterBottom()`](#withmouseenterbottom)
  - [`withMouseLeaveLeft()`](#withmouseleaveleft)
  - [`withMouseLeaveRight()`](#withmouseleaveright)
  - [`withMouseLeaveTop()`](#withmouseleavetop)
  - [`withMouseLeaveBottom()`](#withmouseleavebottom)
  - [`withOnlyClick()`](#withonlyclick)
  - [`withAltClick()`](#withaltclick)
  - [`withCtrlClick()`](#withctrlclick)
  - [`withMetaClick()`](#withmetaclick)
  - [`withShiftClick()`](#withshiftclick)
- [HOC Composers](#hoc-composers)
  - [`composeMouseModifierKey()`](#composemousemodifierkey)

## Higher-order components

### `withMouseRest()`

```js
withMouseRest
  duration?: integer = 500
): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseRest-*`) that is triggered when the user has rested the mouse over a component (and doesn't mouse out of that component or mouse down on it) for a specified duration of time.

```js
import {withMouseRest} from 'react-composite-events'
// or
import {withMouseRest} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseRest(100)('div')

export default MyComponent extends PureComponent {
  _handleMouseRest() {
    console.log(`100ms with mouse resting`);
  }

  render() {
    return (
      <EnhancedDiv onMouseRest-100={this._handleMouseRest.bind(this)} />
    )
  }
}
```

When no `duration` parameter is specified, then the value for this parameter is defaulted to `500` (500 milliseconds). In this case the composite event prop is simply `onMouseRest`.

```js
import {withMouseRest} from 'react-composite-events'
// or
import {withMouseRest} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseRest()('div')

export default MyComponent extends PureComponent {
  _handleMouseRest() {
    console.log(`default mouse rest!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseRest={this._handleMouseRest.bind(this)} />
    )
  }
}
```

> `withMouseRest` adds handlers for `onMouseOver`, `onMouseMove`, `onMouseOut` & `onMouseDown` to build the `onMouseRest` composite event. The handler for `onMouseRest` will receive the event object for either `onMouseOver` or `onMouseMove`, if it exists.

See related [`withMouseRemainOver()`](#withmouseremainover).



### `withMouseRemainOut()`

```js
withMouseRemainOut
  duration?: integer = 500
): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseRemainOut-*`) that is triggered when the user mouses out of a component and doesn't mouse over that component again for a specified duration of time.

```js
import {withMouseRemainOut} from 'react-composite-events'
// or
import {withMouseRemainOut} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseRemainOut(333)('div')

export default MyComponent extends PureComponent {
  _handleMouseRemainOut() {
    console.log(`333ms with mouse remaining out`);
  }

  render() {
    return (
      <EnhancedDiv onMouseRemainOut-333={this._handleMouseRemainOut.bind(this)} />
    )
  }
}
```

When no `duration` parameter is specified, then the value for this parameter is defaulted to `500` (500 milliseconds). In this case the composite event prop is simply `onMouseRemainOut`.

```js
import {withMouseRemainOut} from 'react-composite-events'
// or
import {withMouseRemainOut} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseRemainOut()('div')

export default MyComponent extends PureComponent {
  _handleMouseRemainOut() {
    console.log(`default mouse remain out!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseRemainOut={this._handleMouseRemainOut.bind(this)} />
    )
  }
}
```

> `withMouseRemainOut` adds handlers for `onMouseOut` & `onMouseOver` to build the `onMouseRemainOut` composite event. The handler for `onMouseRemainOut` will receive the event object for `onMouseOut`, if it exists.

See related [`withMouseRemainOver()`](#withmouseremainover).



### `withMouseRemainOver()`

```js
withMouseRemainOver
  duration?: integer = 500
): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseRemainOver-*`) that is triggered when the user mouses over a component and doesn't mouse out of that component or mouse down on it for a specified duration of time. The user can continue to move the mouse over the component to trigger `onMouseRemainOver`.

```js
import {withMouseRemainOver} from 'react-composite-events'
// or
import {withMouseRemainOver} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseRemainOver(450)('div')

export default MyComponent extends PureComponent {
  _handleMouseRemainOver() {
    console.log(`450ms with mouse remaining over`);
  }

  render() {
    return (
      <EnhancedDiv onMouseRemainOver-450={this._handleMouseRemainOver.bind(this)} />
    )
  }
}
```

When no `duration` parameter is specified, then the value for this parameter is defaulted to `500` (500 milliseconds). In this case the composite event prop is simply `onMouseRemainOver`.

```js
import {withMouseRemainOver} from 'react-composite-events'
// or
import {withMouseRemainOver} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseRemainOver()('div')

export default MyComponent extends PureComponent {
  _handleMouseRemainOver() {
    console.log(`default mouse remain over!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseRemainOver={this._handleMouseRemainOver.bind(this)} />
    )
  }
}
```

> `withMouseRemainOver` adds handlers for `onMouseOver`, `onMouseMove`, `onMouseOut` & `onMouseDown` to build the `onMouseRemainOver` composite event. The handler for `onMouseRemainOver` will receive the event object for either `onMouseOver` or `onMouseMove`, if it exists.

See related [`withMouseRest()`](#withmouserest) & [`withMouseRemainOut()`](#withmouseremainout).



### `withMouseEnterLeft()`

```js
withMouseEnterLeft(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseEnterLeft`) that is triggered when the user mouses over a DOM element (or component that passes a DOM element) at the left edge.

```js
import {withMouseEnterLeft} from 'react-composite-events'
// or
import {withMouseEnterLeft} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseEnterLeft()('div')

export default MyComponent extends PureComponent {
  _handleMouseEnterLeft() {
    console.log(`mouse entered from the left!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseEnterLeft={this._handleMouseEnterLeft.bind(this)} />
    )
  }
}
```

> `withMouseEnterLeft` adds a handler for `onMouseEnter` to build the `onMouseEnterLeft` composite event. It expects a DOM event object to be passed to `onMouseEnter` in order to determine the direction from which the mouse entered. The handler for `onMouseEnterLeft` will receive the event object for `onMouseEnter`.

See related [`withMouseEnterRight()`](#withmouseenterright), [`withMouseEnterTop()`](#withmouseentertop) & [`withMouseEnterBottom()`](#withmouseenterbottom).



### `withMouseEnterRight()`

```js
withMouseEnterRight(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseEnterRight`) that is triggered when the user mouses over a DOM element (or component that passes a DOM element) at the right edge.

```js
import {withMouseEnterRight} from 'react-composite-events'
// or
import {withMouseEnterRight} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseEnterRight()('div')

export default MyComponent extends PureComponent {
  _handleMouseEnterRight() {
    console.log(`mouse entered from the right!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseEnterRight={this._handleMouseEnterRight.bind(this)} />
    )
  }
}
```

> `withMouseEnterRight` adds a handler for `onMouseEnter` to build the `onMouseEnterRight` composite event. It expects a DOM event object to be passed to `onMouseEnter` in order to determine the direction from which the mouse entered. The handler for `onMouseEnterRight` will receive the event object for `onMouseEnter`.

See related [`withMouseEnterLeft()`](#withmouseenterleft), [`withMouseEnterTop()`](#withmouseentertop) & [`withMouseEnterBottom()`](#withmouseenterbottom).



### `withMouseEnterTop()`

```js
withMouseEnterTop(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseEnterTop`) that is triggered when the user mouses over a DOM element (or component that passes a DOM element) at the top edge.

```js
import {withMouseEnterTop} from 'react-composite-events'
// or
import {withMouseEnterTop} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseEnterTop()('div')

export default MyComponent extends PureComponent {
  _handleMouseEnterTop() {
    console.log(`mouse entered from the top!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseEnterTop={this._handleMouseEnterTop.bind(this)} />
    )
  }
}
```

> `withMouseEnterTop` adds a handler for `onMouseEnter` to build the `onMouseEnterTop` composite event. It expects a DOM event object to be passed to `onMouseEnter` in order to determine the direction from which the mouse entered. The handler for `onMouseEnterTop` will receive the event object for `onMouseEnter`.

See related [`withMouseEnterLeft()`](#withmouseenterleft), [`withMouseEnterRight()`](#withmouseenterright) & [`withMouseEnterBottom()`](#withmouseenterbottom).



### `withMouseEnterBottom`

```js
withMouseEnterBottom(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseEnterBottom`) that is triggered when the user mouses over a DOM element (or component that passes a DOM element) at the bottom edge.

```js
import {withMouseEnterBottom} from 'react-composite-events'
// or
import {withMouseEnterBottom} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseEnterBottom()('div')

export default MyComponent extends PureComponent {
  _handleMouseEnterBottom() {
    console.log(`mouse entered from the bottom!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseEnterBottom={this._handleMouseEnterBottom.bind(this)} />
    )
  }
}
```

> `withMouseEnterBottom` adds a handler for `onMouseEnter` to build the `onMouseEnterBottom` composite event. It expects a DOM event object to be passed to `onMouseEnter` in order to determine the direction from which the mouse entered. The handler for `onMouseEnterBottom` will receive the event object for `onMouseEnter`.

See related [`withMouseEnterLeft()`](#withmouseenterleft), [`withMouseEnterRight()`](#withmouseenterright) & [`withMouseEnterTop()`](#withmouseentertop).


### `withMouseLeaveLeft`

```js
withMouseLeaveLeft(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseLeaveLeft`) that is triggered when the user mouses out of a DOM element (or component that passes a DOM element) at the left edge.

```js
import {withMouseLeaveLeft} from 'react-composite-events'
// or
import {withMouseLeaveLeft} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseLeaveLeft()('div')

export default MyComponent extends PureComponent {
  _handleMouseLeaveLeft() {
    console.log(`mouse left from the left!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseLeaveLeft={this._handleMouseLeaveLeft.bind(this)} />
    )
  }
}
```

> `withMouseLeaveLeft` adds a handler for `onMouseLeave` to build the `onMouseLeaveLeft` composite event. It expects a DOM event object to be passed to `onMouseLeave` in order to determine the direction from which the mouse left. The handler for `onMouseLeaveLeft` will receive the event object for `onMouseLeave`.

See related [`withMouseLeaveRight()`](#withmouseleaveright), [`withMouseLeaveTop()`](#withmouseleavetop) & [`withMouseLeaveBottom()`](#withmouseleavebottom).



### `withMouseLeaveRight`

```js
withMouseLeaveRight(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseLeaveRight`) that is triggered when the user mouses out of a DOM element (or component that passes a DOM element) at the right edge.

```js
import {withMouseLeaveRight} from 'react-composite-events'
// or
import {withMouseLeaveRight} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseLeaveRight()('div')

export default MyComponent extends PureComponent {
  _handleMouseLeaveRight() {
    console.log(`mouse left from the right!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseLeaveRight={this._handleMouseLeaveRight.bind(this)} />
    )
  }
}
```

> `withMouseLeaveRight` adds a handler for `onMouseLeave` to build the `onMouseLeaveRight` composite event. It expects a DOM event object to be passed to `onMouseLeave` in order to determine the direction from which the mouse left. The handler for `onMouseLeaveRight` will receive the event object for `onMouseLeave`.

See related [`withMouseLeaveLeft()`](#withmouseleaveleft), [`withMouseLeaveTop()`](#withmouseleavetop) & [`withMouseLeaveBottom()`](#withmouseleavebottom).



### `withMouseLeaveTop`

```js
withMouseLeaveTop(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseLeaveTop`) that is triggered when the user mouses out of a DOM element (or component that passes a DOM element) at the top edge.

```js
import {withMouseLeaveTop} from 'react-composite-events'
// or
import {withMouseLeaveTop} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseLeaveTop()('div')

export default MyComponent extends PureComponent {
  _handleMouseLeaveTop() {
    console.log(`mouse left from the top!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseLeaveTop={this._handleMouseLeaveTop.bind(this)} />
    )
  }
}
```

> `withMouseLeaveTop` adds a handler for `onMouseLeave` to build the `onMouseLeaveTop` composite event. It expects a DOM event object to be passed to `onMouseLeave` in order to determine the direction from which the mouse left. The handler for `onMouseLeaveTop` will receive the event object for `onMouseLeave`.

See related [`withMouseLeaveLeft()`](#withmouseleaveleft), [`withMouseLeaveRight()`](#withmouseleaveright) & [`withMouseLeaveBottom()`](#withmouseleavebottom).



### `withMouseLeaveBottom`

```js
withMouseLeaveBottom(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMouseLeaveBottom`) that is triggered when the user mouses out of a DOM element (or component that passes a DOM element) at the bottom edge.

```js
import {withMouseLeaveBottom} from 'react-composite-events'
// or
import {withMouseLeaveBottom} from 'react-composite-events/mouse'

const EnhancedDiv = withMouseLeaveBottom()('div')

export default MyComponent extends PureComponent {
  _handleMouseLeaveBottom() {
    console.log(`mouse left from the bottom!`);
  }

  render() {
    return (
      <EnhancedDiv onMouseLeaveBottom={this._handleMouseLeaveBottom.bind(this)} />
    )
  }
}
```

> `withMouseLeaveBottom` adds a handler for `onMouseLeave` to build the `onMouseLeaveBottom` composite event. It expects a DOM event object to be passed to `onMouseLeave` in order to determine the direction from which the mouse left. The handler for `onMouseLeaveBottom` will receive the event object for `onMouseLeave`.

See related [`withMouseLeaveLeft()`](#withmouseleaveleft), [`withMouseLeaveRight()`](#withmouseleaveright) & [`withMouseLeaveTop()`](#withmouseleavetop).



### `withOnlyClick`

```js
withOnlyClick(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onOnlyClick`) that is triggered when the user clicks a DOM element (or component that passes a DOM element) with *no* modifier keys pressed.

```js
import {withOnlyClick} from 'react-composite-events'
// or
import {withOnlyClick} from 'react-composite-events/mouse'

const EnhancedDiv = withOnlyClick()('div')

export default MyComponent extends PureComponent {
  _handleOnlyClick() {
    console.log(`Only click (no modifier keys)!`);
  }

  render() {
    return (
      <EnhancedDiv onOnlyClick={this._handleOnlyClick.bind(this)} />
    )
  }
}
```

> `withOnlyClick` adds a handler for `onClick` to build the `onOnlyClick` composite event. It expects a DOM event object to be passed to `onClick` in order to verify that no modifier keys were pressed. The handler for `onOnlyClick` will receive the event object for `onClick`.

See related [`composeMouseModifierKey()`](#composemousemodifierkey), [`withAltClick()`](#withaltclick), [`withCtrlClick()`](#withctrlclick), [`withMetaClick()`](#withmetaclick) & [`withShiftClick()`](#withshiftclick).



### `withAltClick`

```js
withAltClick(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onAltClick`) that is triggered when the user clicks a DOM element (or component that passes a DOM element) with *only* the `Alt` modifier key pressed.

```js
import {withAltClick} from 'react-composite-events'
// or
import {withAltClick} from 'react-composite-events/mouse'

const EnhancedDiv = withAltClick()('div')

export default MyComponent extends PureComponent {
  _handleAltClick() {
    console.log(`Alt only + click!`);
  }

  render() {
    return (
      <EnhancedDiv onAltClick={this._handleAltClick.bind(this)} />
    )
  }
}
```

> `withAltClick` adds a handler for `onClick` to build the `onAltClick` composite event. It expects a DOM event object to be passed to `onClick` in order to determine the modifier key that was pressed. The handler for `onAltClick` will receive the event object for `onClick`.

See related [`composeMouseModifierKey()`](#composemousemodifierkey), [`withOnlyClick()`](#withonlyclick), [`withCtrlClick()`](#withctrlclick), [`withMetaClick()`](#withmetaclick) & [`withShiftClick()`](#withshiftclick).



### `withCtrlClick`

```js
withCtrlClick(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onCtrlClick`) that is triggered when the user clicks a DOM element (or component that passes a DOM element) with *only* the `Ctrl` modifier key pressed.

```js
import {withCtrlClick} from 'react-composite-events'
// or
import {withCtrlClick} from 'react-composite-events/mouse'

const EnhancedDiv = withCtrlClick()('div')

export default MyComponent extends PureComponent {
  _handleCtrlClick() {
    console.log(`Ctrl only + click!`);
  }

  render() {
    return (
      <EnhancedDiv onCtrlClick={this._handleCtrlClick.bind(this)} />
    )
  }
}
```

> `withCtrlClick` adds a handler for `onClick` to build the `onCtrlClick` composite event. It expects a DOM event object to be passed to `onClick` in order to determine the modifier key that was pressed. The handler for `onCtrlClick` will receive the event object for `onClick`.

See related [`composeMouseModifierKey()`](#composemousemodifierkey), [`withOnlyClick()`](#withonlyclick), [`withAltClick()`](#withaltclick), [`withMetaClick()`](#withmetaclick) & [`withShiftClick()`](#withshiftclick).



### `withMetaClick`

```js
withMetaClick(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onMetaClick`) that is triggered when the user clicks a DOM element (or component that passes a DOM element) with *only* the `Meta` modifier key (Mac `Cmd` modifier key) pressed.

```js
import {withMetaClick} from 'react-composite-events'
// or
import {withMetaClick} from 'react-composite-events/mouse'

const EnhancedDiv = withMetaClick()('div')

export default MyComponent extends PureComponent {
  _handleMetaClick() {
    console.log(`Meta only + click!`);
  }

  render() {
    return (
      <EnhancedDiv onMetaClick={this._handleMetaClick.bind(this)} />
    )
  }
}
```

> `withMetaClick` adds a handler for `onClick` to build the `onMetaClick` composite event. It expects a DOM event object to be passed to `onClick` in order to determine the modifier key that was pressed. The handler for `onMetaClick` will receive the event object for `onClick`.

See related [`composeMouseModifierKey()`](#composemousemodifierkey), [`withOnlyClick()`](#withonlyclick), [`withAltClick()`](#withaltclick), [`withCtrlClick()`](#withctrlclick) & [`withShiftClick()`](#withshiftclick).



### `withShiftClick`

```js
withShiftClick(): HigherOrderComponent
```

Creates an HOC for a composite event (named `onShiftClick`) that is triggered when the user clicks a DOM element (or component that passes a DOM element) with *only* the `Shift` modifier key pressed.

```js
import {withShiftClick} from 'react-composite-events'
// or
import {withShiftClick} from 'react-composite-events/mouse'

const EnhancedDiv = withShiftClick()('div')

export default MyComponent extends PureComponent {
  _handleShiftClick() {
    console.log(`Shift only + click!`);
  }

  render() {
    return (
      <EnhancedDiv onShiftClick={this._handleShiftClick.bind(this)} />
    )
  }
}
```

> `withShiftClick` adds a handler for `onClick` to build the `onShiftClick` composite event. It expects a DOM event object to be passed to `onClick` in order to determine the modifier key that was pressed. The handler for `onShiftClick` will receive the event object for `onClick`.

See related [`composeMouseModifierKey()`](#composemousemodifierkey), [`withOnlyClick()`](#withonlyclick), [`withAltClick()`](#withaltclick), [`withCtrlClick()`](#withctrlclick) & [`withMetaClick()`](#withmetaclick).



## HOC Composers

### `composeMouseModifierKey()`

```js
composeMouseModifierKey({
  eventPropName: string,
  mouseEvent: string,
  ?alt: boolean = false,
  ?ctrl: boolean = false,
  ?meta: boolean = false,
  ?shift: boolean = false
}): HigherOrderComponent
```

(Advanced use) Returns a composite event higher-order component (a `Function`) that is triggered when the specified mouse event occurs with the specific combination of modifier keys pressed.

`composeMouseModifierKey` is intended for advanced users wishing to create their own unique composite event HOC based on a mouse event plus modifier keys, beyond those that are supplied as built-in composite events within `react-composite-events/mouse`. First check if [`withOnlyClick()`](#withonlyclick), [`withAltClick()`](#withaltclick), [`withCtrlClick()`](#withctrlclick), [`withMetaClick()`](#withmetaclick) or [`withShiftClick()`](#withshiftclick) will suit your needs.

#### `composeMouseModifierKey()` Example

```js
import {composeMouseModifierKey} from 'react-composite-events'
// or
import {composeMouseModifierKey} from 'react-composite-events/mouse'

const withShiftMetaMouseEnter = composeMouseModifierKey({
  eventPropName: 'onShiftMetaMouseEnter',
  mouseEvent: 'onMouseEnter',
  meta: true,
  shift: true
})

const EnhancedDiv = withShiftMetaMouseEnter()('div')

export default MyComponent extends PureComponent {
  _handleShiftMetaMouseEnter() {
    console.log(`Shift + meta keys pressed while mouse entered!`);
  }

  render() {
    return (
      <EnhancedDiv onShiftMetaMouseEnter={this._handleShiftMetaMouseEnter.bind(this)} />
    )
  }
}
```

#### `composeMouseModifierKey()` Configuration

- **eventPropName** - (Required) A `string` specifying the name of the prop that will be made available to the wrapped component. In keeping with the React standard, the `eventPropName` should start with `'on'`, e.g. `'onShiftMetaMouseEnter'`.
- **mouseEvent** - (Required) A `string` name of an event that triggers the start of the composite event.
- **alt/ctrl/meta/shift** - (Optional) A boolean indicating whether or not the composite event should be triggered when the modifier key is pressed. The corresponding modifier key for a property *must* be pressed if it is configured `true` in order for the composite event to be triggered. Similarly the corresponding modifier key for a property *must not* be pressed if it is configured `false`. Therefore if `alt` & `ctrl` are set to `true`, but `Alt`, `Ctrl` & `Shift` are pressed, the composite event will not be triggered. Similarly if only `Ctrl` is pressed, the composite event also will not be fired.

> The HOC returned by `composeMouseModifierKey` adds a handler for the `mouseEvent` to build the `eventPropName` composite event. It expects a DOM event object to be passed to the `eventPropName` in order to determine the modifier key(s) that was/were pressed. The handler for the `eventPropName` will receive the event object for `mouseEvent`.

#### `composeMouseModifierKey()` Rationale

Consider the following hypothetical example that adds handlers for only-clicking (no modifier keys pressed), ctrl-clicking (only Ctrl modifier key pressed), shift-clicking (only Shift modifier key pressed), meta-clicking (only Meta modifier key pressed), and alt-clicking (only Alt modifier key pressed):

Instead of:

```js
export default MyComponent extends PureComponent {
  _handleOnClick(e) {
    if (!e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      console.log('only-click!');
    } else if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      console.log('shift-click!');
    } else if (!e.shiftKey && e.ctrlKey && !e.metaKey && !e.altKey) {
      console.log('ctrl-click!');
    } else if (!e.shiftKey && !e.ctrlKey && e.metaKey && !e.altKey) {
      console.log('meta-click!');
    } else if (!e.shiftKey && !e.ctrlKey && !e.metaKey && e.altKey) {
      console.log('alt-click!');
    }
  }

  render() {
    return (
      <EnhancedDiv onClick={this._handleOnClick.bind(this)} />
    )
  }
}
```

You can do:

```js
import _compose from 'lodash.compose'
import {
  withOnlyClick, 
  withShiftClick, 
  withCtrlClick, 
  withMetaClick, 
  withAltClick
} from 'react-composite-events'

const enhance = _compose(
  withOnlyClick(),
  withShiftClick(),
  withCtrlClick(),
  withMetaClick(),
  withAltClick()
)

const EnhancedDiv = enhance('div')

export default MyComponent extends PureComponent {
  _handleOnlyClick() {
    console.log(`Only click (no modifier keys)!`);
  }
  _handleShiftClick() {
    console.log(`Shift only + click!`);
  }
  _handleCtrlClick() {
    console.log(`Ctrl only + click!`);
  }
  _handleMetaClick() {
    console.log(`Meta only + click!`);
  }
  _handleAltClick() {
    console.log(`Alt only + click!`);
  }

  render() {
    return (
      <EnhancedDiv 
        onOnlyClick={this._handleOnlyClick.bind(this)}
        onShiftClick={this._handleShiftClick.bind(this)}
        onCtrlClick={this._handleCtrlClick.bind(this)}
        onMetaClick={this._handleMetaClick.bind(this)}
        onAltClick={this._handleAltClick.bind(this)}
      />
    )
  }
}
```

While the latter example using the composite events seems more verbose, it's much clearer to read. The HOCs do all the heavy lifting of testing against modifier keys instead of the applicatino code having to do it. In addition, when you start having combinations with multiple modifier keys (as in the [`composeMouseModifierKey()` Example](#composemousemodifierkey-example)), the composite events are far easier to use.
