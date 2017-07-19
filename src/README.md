# Top-level API docs

## `compose`

(Advanced use) Returns a composite event higher-order component (a `Function`) that is triggered by the specified trigger events and that is optionally canceled by the specified cancel events during a specified amount of time.

`compose` is intended for advanced users wishing to create their own unique composite event higher-order components, beyond those that are supplied as built-in composite events within `react-composite-events`. It's unlikely that you will use `compose` directly in a client application, but is available if the composite event you need does not yet exist.

### `withMouseRest` Example

```js
// import `compose` HOC maker
import {compose} from 'react-composite-events'

// make your own "mouse rest" composite event by passing configuration
// options to `compose`
const withMouseRest = compose({
  eventPropName: 'onMouseRest',
  triggerEvent: ['onMouseOver','onMouseMove'],
  defaultDuration: 150,
  cancelEvent: ['onMouseOut','onMouseDown'],
  shouldResetTimerOnRetrigger: true,
  allowRefire: false,
})

// wrap div with `withMouseRest` HOC configured to fire event
// after 500 milliseconds. This will make a `onMouseRest-500`
// composite event prop available
const FancyDiv = withMouseRest(500)('div')

export default MyComponent extends PureComponent {
  _handleMouseRest() {
    console.log('mouse rested for 500 milliseconds');
  }

  render() {
    // Pass handler to `onMouseRest-500` composite event prop
    return (
      <FancyDiv onMouseRest-500={this._handleMouseRest.bind(this)}>
        Trigger event after mouse rests for 500 milliseconds
      </FancyDiv>
    )
  }
}
```

The above call would make a parameterized composite event higher-order component that would be used to add `onMouseRest-*` props to wrapped components.

### `eventPropName`

**(Required)** A `string` specifying the name of the prop that will be made available to the wrapped component. In keeping with the React standard, the `eventPropName` should start with `'on'`, e.g. `'onMouseRest'`.

### `triggerEvent`

**(Required)** A `string` name of an event or `Array<String>` of event names that trigger(s) the start of the composite event.

### `defaultDuration`

**(Optional)** A `number` of milliseconds indicating the default duration of time that the composite event should last. The higher-order component that `compose` returns takes an optional duration parameter. When that duration parameter is not specified or `undefined`, the `defaultDuration` is used. Using the [`withMouseRest` example](#withmouserest-example) , if instead `FancyDiv` was created without specifying a duration like:

```js
const FancyDiv = withMouseRest()('div')
```

Then `FancyDiv` will use the `defaultDuration` of 150 (milliseconds). As a result of not specifying a duration, the `onMouseRest` prop will not be parameterized:

```js
const FancyDiv = withMouseRest()('div');

export default MyComponent extends PureComponent {
  _handleMouseRest() {
    console.log('mouse rested for default 150 milliseconds');
  }

  render() {
    // Pass handler to `onMouseRest` composite event prop
    return (
      <FancyDiv onMouseRest={this._handleMouseRest.bind(this)}>
        Trigger event after mouse rests for default 150 milliseconds
      </FancyDiv>
    )
  }
}
```

If `defaultDuration` isn't specified, or has a value less than or equal to `0`, `null` or `undefined`, then time will not be a factor in the composite event. The [`cancelEvent`](#cancelevent), [`shouldResetTimerOnRetrigger`](#shouldresettimeronretrigger) & [`allowRefire`](#allowrefire) configurations no longer apply. However, you will most likely make use of the [`beforeCallback`](#beforecallback) configuration.

Typically `defaultDuration` is omitted when the initial [`triggerEvent`](#triggerevent) is enough to formulate the composite event. An example is a DOM event that modifier key properties such that you can create an `onCtrlClick` composite event. In this case time is not a factor in the composite event.

When `defaultDuration` is omitted, the resultant higher-order component doesn't accept and parameters, and the prop added to the component is not parameterized:

```js
// import `compose` HOC maker
import {compose} from 'react-composite-events'

// make your own "mouse rest" composite event by passing configuration
// options to `compose`
const withCtrlClick = compose({
  eventPropName: 'onCtrlClick',
  triggerEvent: 'click',
  beforeCallback: (handler, domEvent) => {
    if (domEvent.ctrlKey) {
      // call event handler only if ctrl key
      // was also pressed
      handler(domEvent);
    }
  }
})

// wrap div with `withCtrlClick` HOC configured to fire event
// when mouse is clicked with Ctrl modifier. This will make
// `onCtrlClick` composite event prop available.
// Because no `defaultDuration` was specified, the HOC takes
// no parameters
const FancyDiv = withCtrlClick()('div')

export default MyComponent extends PureComponent {
  _handleCtrlClick() {
    console.log('Ctrl+Click!!!!!');
  }

  render() {
    // Pass handler to `onCtrlClick` composite event prop
    return (
      <FancyDiv onCtrlClick={this._handleCtrlClick.bind(this)}>
        Trigger event after Ctrl+Click
      </FancyDiv>
    )
  }
}
```

### `cancelEvent`

**(Optional)** A `string` name of an event or `Array<String>` of event names that cancel(s) the timer started by [`triggerEvent`](#triggerevent) when a [`defaultDuration`](#defaultduration) is specified.

If the `cancelEvent` occurs before the timer ends, the composite event is not completed and its handler will not be called. `cancelEvent` is ignored if [`defaultDuration`](#defaultduration) is unspecified.

### `shouldResetTimerOnRetrigger`

**(Optional)** A `boolean` specifying whether or not a [`triggerEvent`](#triggerevent) should reset the timer. If this optional configuration is not specified, then the value `true` will be used as a default.

For the [`withMouseRest` example](#withmouserest-example), if another `onMouseOver` event happens after the initial one that began the composite event, the timer will be reset since `shouldResetTimerOnRetrigger` is `true`. This is because once the mouse starts moving, it's no longer at rest so the timer needs to be reset. If instead you were building a `mouseRemainOver` composite event where the mouse has to just remain over an element but can move around freely, `shouldResetTimerOnRetrigger` should be `false`. `onMouseMove` would trigger the composite event, and continuing to move shouldn't reset the timer. Additional `onMouseMove` events should just be ignored.

`shouldResetTimerOnRetrigger` is ignored if [`defaultDuration`](#defaultduration) is unspecified.

### `allowRefire`

**(Optional)** TODO...

`allowRefire` is ignored if [`defaultDuration`](#defaultduration) is unspecified.

### `beforeCallback`

**(Optional)** TODO...
