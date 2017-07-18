# React Composite Events

[![Build Status](https://travis-ci.org/benmvp/react-composite-events.svg?branch=master)](https://travis-ci.org/benmvp/react-composite-events)
[![Maintenance Status](https://img.shields.io/badge/status-maintained-brightgreen.svg)](https://github.com/benmvp/react-composite-events/pulse)

Easily create composite events for transparent use in React components.

## `react-composite-events` is currently under initial design and not available for use!

`react-composite-events` is inspired by the [`Uize.Dom.VirtualEvent`](https://github.com/UIZE/UIZE-JavaScript-Framework/blob/master/site-source/js/Uize/Dom/VirtualEvent.js) module that is a part of the open-source [UIZE JavaScript Framework](https://github.com/UIZE/UIZE-JavaScript-Framework). 

## Installation

TBD

## Quick Usage

You use composite events by wrapping a comoponent in a higher-order component (HOC) that will provide a handler to the composite event:

```js
// import `addMouseRest` HOC
import {addMouseRest} from 'react-composite-events/mouse'

// wrap div with `addMouseRest` HOC configured to fire event
// after 150 milliseconds. This will make a `onMouseRest-150`
// composite event prop available
const FancyDiv = addMouseRest(150)('div')

export default MyComponent extends PureComponent {
  _handleMouseRest() {
    console.log('mouse rested for 150 milliseconds');
  }

  render() {
    // Pass handler to `onMouseRest-150` composite event prop
    return (
      <FancyDiv onMouseRest-150={this._handleMouseRest.bind(this)}>
        Trigger event after mouse rests for 150 milliseconds
      </FancyDiv>
    )
  }
}
```

Imagine a navigation menu that displays on hover. You don't want the menu activated just when the user passes over the menu. You want it to activate when they've rested on the menu for a "short while" to indicate their interest. `onMouseOver` will trigger even if the mouse is just passing over an element, whereas the `onMouseRest` composite event will trigger only after the user has lingered for a bit. The "mouse rest" composite event is a better solution than a simple `onMouseOver`.

## What is a React Composite Event?

A "React Composite Event" is an event for a component that is not part of its standard set of events, but is implemented in supplemental JavaScript code. It can be an event happening over time. In the case of DOM events, it can be a filter of existing DOM events.

A rather compelling and highly practical example is the "remain-in-state" DOM-related composite events. These allow handlers to be executed when a node remains in a specific event state for a specified amount of time (i.e. the user rests the mouse over a node for more than half a second).

## Benefits of React Composite Events

React Composite Events offer the following key benefits...

### Encapsulation

React Composite Events allow sophisticated interactions with a component to be encapsulated into an implementation, so that the interaction can then be expressed as a single event.

Once a pattern of interaction is encapsulated into an implementation, you can then simply think of that interaction as its own event. The [What is a React Composite Event?](#what-is-a-react-composite-event) section discusses the classic example of the "mouse rest" composite event, which encapsulates handling `onMouseOver`, `onMouseMove`, `onMouseOut`, and `onMouseDown` events of a DOM node, and also manages state for a timeout.

### Semantically Equivalent to Real Events

React Composite Events are semantically equivalent to actual events on a component. These events are "injected" into a component as props by wrapping it in a higher-order component (HOC).

This means that you can use them and think about them in your React apps as if they **were** actual events on a component. This also means that you can add handlers for composite events along with actual component events.

### Customizable Using Parameters

While a composite event itself doesn't take parameters, the HOC that creates it can accept parameters and produce different versions of the same "flavor" of composite event with slighly different behavior depending on the values supplied.

This may sound a little abstract, but what this means is that you can tune the behavior of a certain type of composite event through its parameters. Take the example of the "mouse rest" composite event. It lets you specify how long the mouse should be rested on a DOM node before the event is fired. This parameter makes this type of composite event more versatile than if it only supported one rest duration.

## API Docs

The React Composite Event HOCs are grouped by domain:

- [**Base**](src/) - the base HOC maker from which all other HOCs are built
- [**Input**](input/) - the HOCs that create composite events with inputs (intended to be environment-agnostic)
- [**Mouse**](mouse/) - the HOCs that create composite events around DOM mouse events
- [**Key**](key/) - the HOCs that create composite events around DOM keyboard events

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## Project philosophy

We take the stability of this utility package **very** seriously. `react-composite-events` follows the [SemVer](http://semver.org/) standard for versioning.

All updates must pass the [CI build](https://travis-ci.org/benmvp/react-composite-events).

## License

[MIT](LICENSE). Copyright (c) 2017 Ben Ilegbodu.
