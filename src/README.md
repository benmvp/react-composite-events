# `compose()`

```js
compose({
  eventPropName: string,
  triggerEvent: string | string[],
  ?defaultDuration: number = 0,
  ?cancelEvent: string | string[],
  ?shouldResetTimerOnRetrigger: boolean = true,
  ?beforeHandle: (handler: (?event: Event) => void, ?event: Event) => boolean | void
}): HigherOrderComponent
```

(Advanced use) Returns a composite event higher-order component (a `Function`) that is triggered by the specified trigger events and that is optionally canceled by the specified cancel events during a specified amount of time.

`compose` is intended for advanced users wishing to create their own unique composite event higher-order components, beyond those that are supplied as built-in composite events within `react-composite-events`. It's unlikely that you will use `compose` directly in a client application, but is available if the composite event you need does not yet exist.

## ToC

- [`withMouseRest` Example](#withmouserest-example)
- [`eventPropName`](#eventpropname)
- [`triggerEvent`](#triggerevent)
- [`defaultDuration`](#defaultduration)
- [`cancelEvent`](#cancelevent)
- [`shouldResetTimerOnRetrigger`](#shouldresettimeronretrigger)
- [`beforeHandle()`](#beforehandle)

## `withMouseRest` Example

```js
// import `compose` HOC maker
import {compose} from 'react-composite-events'

// make your own "mouse rest" composite event by passing configuration
// options to `compose`
const withMouseRest = compose({
  eventPropName: 'onMouseRest',
  triggerEvent: ['onMouseOver', 'onMouseMove'],
  defaultDuration: 150,
  cancelEvent: ['onMouseOut', 'onMouseDown'],
  shouldResetTimerOnRetrigger: true,
})

// wrap div with `withMouseRest` HOC configured to fire event
// after 500 milliseconds. This will make a `onMouseRest-500`
// composite event prop available
const EnhancedDiv = withMouseRest(500)('div')

export default MyComponent extends PureComponent {
  _handleMouseRest() {
    console.log('mouse rested for 500 milliseconds');
  }

  render() {
    // Pass handler to `onMouseRest-500` composite event prop
    return (
      <EnhancedDiv onMouseRest-500={this._handleMouseRest.bind(this)}>
        Trigger event after mouse rests for 500 milliseconds
      </EnhancedDiv>
    )
  }
}
```

The above call would make a parameterized composite event higher-order component that would be used to add `onMouseRest-*` props to wrapped components.

## `eventPropName`

**(Required)** A `string` specifying the name of the prop that will be made available to the wrapped component. In keeping with the React standard, the `eventPropName` should start with `'on'`, e.g. `'onMouseRest'`.

## `triggerEvent`

**(Required)** A `string` name of an event or `string[]` of event names that trigger(s) the start of the composite event.

> The handler for the composite event will receive the event object from the `triggerEvent`, if it exists.

> If the `triggerEvent` matches an event passed to the enhanced component, it will be merged. For instance in the [`withMouseRest` example](#withmouserest-example), `onMouseOver` is one of the trigger events. If an `onMouseOver` handler was also passed to `<EnhancedDiv>` in addition `onMouseRest-500`, it will also be called.

## `defaultDuration`

**(Optional)** A `number` of milliseconds indicating the default duration of time that the composite event should last. The higher-order component that `compose` returns takes an optional duration parameter. When that duration parameter is not specified or `undefined`, the `defaultDuration` is used. Using the [`withMouseRest` example](#withmouserest-example), if instead `EnhancedDiv` was created without specifying a duration like:

```js
const EnhancedDiv = withMouseRest()('div')
```

Then `EnhancedDiv` will use the `defaultDuration` of 150 (milliseconds). As a result of not specifying a duration, the `onMouseRest` prop will not be parameterized:

```js
const EnhancedDiv = withMouseRest()('div');

export default MyComponent extends PureComponent {
  _handleMouseRest() {
    console.log('mouse rested for default 150 milliseconds');
  }

  render() {
    // Pass handler to `onMouseRest` composite event prop
    return (
      <EnhancedDiv onMouseRest={this._handleMouseRest.bind(this)}>
        Trigger event after mouse rests for default 150 milliseconds
      </EnhancedDiv>
    )
  }
}
```

If `defaultDuration` isn't specified, or has a value less than or equal to `0`, `null` or `undefined`, then time will not be a factor in the composite event. The [`cancelEvent`](#cancelevent) & [`shouldResetTimerOnRetrigger`](#shouldresettimeronretrigger) configurations no longer apply. However, you will most likely make use of the [`beforeHandle()`](#beforehandle) configuration.

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
  beforeHandle: (handler, domEvent) => {
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
const EnhancedDiv = withCtrlClick()('div')

export default MyComponent extends PureComponent {
  _handleCtrlClick() {
    console.log('Ctrl+Click!!!!!');
  }

  render() {
    // Pass handler to `onCtrlClick` composite event prop
    return (
      <EnhancedDiv onCtrlClick={this._handleCtrlClick.bind(this)}>
        Trigger event after Ctrl+Click
      </EnhancedDiv>
    )
  }
}
```

## `cancelEvent`

**(Optional)** A `string` name of an event or `string[]` of event names that cancel(s) the timer started by [`triggerEvent`](#triggerevent) when a [`defaultDuration`](#defaultduration) is specified.

If the `cancelEvent` occurs before the timer ends, the composite event is not completed and its handler will not be called. `cancelEvent` is ignored if [`defaultDuration`](#defaultduration) is unspecified.

> If the `cancelEvent` matches an event passed to the enhanced component, it will be merged. For instance in the [`withMouseRest` example](#withmouserest-example), `onMouseOut` is one of the trigger events. If an `onMouseOut` handler was also passed to `<EnhancedDiv>` in addition `onMouseRest-500`, it will also be called.

> If a [`triggerEvent`](#triggerevent) is also a `cancelEvent`, the composite event will never trigger; it will be immediately cancelled.

## `shouldResetTimerOnRetrigger`

**(Optional)** A `boolean` specifying whether or not a [`triggerEvent`](#triggerevent) should reset the timer. If this optional configuration is not specified, then the value `true` will be used as the default.

For the [`withMouseRest` example](#withmouserest-example), if another `onMouseMove` event happens after the initial one that began the composite event, the timer will be reset since `shouldResetTimerOnRetrigger` is `true`. This is because once the mouse starts moving, it's no longer at rest so the timer needs to be reset. If instead you were building a `mouseRemainOver` composite event where the mouse has to just remain over an element but can move around freely, `shouldResetTimerOnRetrigger` should be `false`. `onMouseMove` would trigger the composite event, and continuing to move shouldn't reset the timer. Additional `onMouseMove` events should just be ignored.

`shouldResetTimerOnRetrigger` is ignored if [`defaultDuration`](#defaultduration) is unspecified.

## `beforeHandle()`

**(Optional)** A `function` that is called before the composite event prop handler is ultimately called. The function receives two parameters: [`handler()`](#handler) & [`event`](#event).

The `beforeHandle()` function is most useful when [`defaultDuration`](#defaultduration) is unspecified. In these cases you're wanting to build the composite event from additional information in the [`event`](#event), and not based on a timer. Within `beforeHandle()`, you have options ways to call the composite event handler.

1. Return `true`, signaling the properties of the [`event`](#event) are such that the composite event should be called. The actual handler will be called by the HOC with the `event` that was passed into `beforeHandle()`. This is the simplest and most common case. If `beforeHandle()` returns `false`, the composite event handler will not be called.
2. Do not return anything (i.e. `undefined`), signaling that you will call the composite event handler directly by calling the [`handler()`](#handler) (with the [`event`](#event)). This option is useful if the logic to determine if the composite event handler should be called is asynchronous or you would like to pass a different, modified event object to the handler.

### `handler()`

A `function` that is the composite event prop handler. This is what React component passed as the value for the composite event prop. Within [`beforeHandle()`](#beforehandle) you will need to explicitly call the `handler()` if you choose not to return a boolean value in order for the composite event prop handler to be called.

### `event`

**(Optional)** An event `object` for the `triggerEvent`. For composite events that aren't time-based, you can use the `event` object to help compose the composite event. Some components may not have event objects for the `triggerEvent`, in which case `event` will be `undefined`. On the web, DOM elements will pass a DOM event for `event`. More often than not, you will want to pass `event` if you call [`handler()`](#handler). If you return a boolean within [`beforeHandle()`](#beforehandle), the `event` object is automatically passed.
