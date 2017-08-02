# Composite Events for React

[![version](https://img.shields.io/npm/v/react-composite-events.svg)](http://npm.im/react-composite-events)
[![downloads](https://img.shields.io/npm/dt/react-composite-events.svg)](http://npm-stat.com/charts.html?package=react-composite-events&from=2017-07-18)
![module formats: umd, cjs, and es](https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![license](https://img.shields.io/github/license/benmvp/react-composite-events.svg)](LICENSE)

[![Maintenance Status](https://img.shields.io/badge/status-maintained-brightgreen.svg)](https://github.com/benmvp/react-composite-events/pulse)
[![Build Status](https://travis-ci.org/benmvp/react-composite-events.svg?branch=master)](https://travis-ci.org/benmvp/react-composite-events)
[![Coverage Status](https://coveralls.io/repos/github/benmvp/react-composite-events/badge.svg?branch=master)](https://coveralls.io/github/benmvp/react-composite-events?branch=master)
[![Dependencies status](https://img.shields.io/david/benmvp/react-composite-events.svg)](https://david-dm.org/benmvp/react-composite-events#info=dependencies)
[![Dev Dependencies status](https://img.shields.io/david/dev/benmvp/react-composite-events.svg)](https://david-dm.org/benmvp/react-composite-events#info=devDependencies)

[![Watch on GitHub](https://img.shields.io/github/watchers/benmvp/react-composite-events.svg?style=social)](https://github.com/benmvp/react-composite-events/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/benmvp/react-composite-events.svg?style=social)](https://github.com/benmvp/react-composite-events/stargazers)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/benmvp/react-composite-events.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20react-composite-events%20by%20%40benmvp!%0A%0Ahttps%3A%2F%2Fgithub.com%2Fbenmvp%2Freact-composite-events)

A collection of higher-order components (HOCs) to easily create composite events in React components.

> `react-composite-events` is currently under alpha development and not available for general public use! Check out the [API Docs](#api-docs) for more info.

`react-composite-events` is [stable](https://travis-ci.org/benmvp/react-composite-events), [dependency-free](https://david-dm.org/benmvp/react-composite-events#info=dependencies), [heavily-tested](https://coveralls.io/github/benmvp/react-composite-events?branch=master) and [well-documented](#api-docs).

## ToC

- [Installation](#installation)
- [Quick Usage](#quick-usage)
- [What is a Composite Event?](#what-is-a-composite-event)
- [Benefits of Composite Events](#benefits-of-composite-events)
- [API Docs](#api-docs)
- [Target Environments](#target-environments)
- [Prior Art](#prior-art)
- [Contributing](CONTRIBUTING.md)
- [Project philosophy](#project-philosophy)
- [License](LICENSE)

## Installation

Install via [Yarn](https://yarnpkg.com/lang/en/docs/managing-dependencies/):

```sh
yarn add react-composite-events
```

Install via [NPM](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
npm install --save react-composite-events
```

## Quick Usage

You use composite events by wrapping a component in a higher-order component (HOC) that will provide a handler to the composite event:

```js
// import `withMouseRest` HOC
import {withMouseRest} from 'react-composite-events/mouse'

// wrap div with `withMouseRest` HOC configured to fire event
// after 150 milliseconds. This will make a `onMouseRest-150`
// composite event prop available
const EnhancedDiv = withMouseRest(150)('div')

export default MyComponent extends PureComponent {
  _handleMouseRest() {
    console.log('mouse rested for 150 milliseconds');
  }

  render() {
    // Pass handler to `onMouseRest-150` composite event prop
    return (
      <EnhancedDiv onMouseRest-150={this._handleMouseRest.bind(this)}>
        Trigger event after mouse rests for 150 milliseconds
      </EnhancedDiv>
    )
  }
}
```

Imagine a navigation menu that displays on hover. You don't want the menu activated just when the user passes over the menu. You want it to activate when they've rested on the menu for a "short while" to indicate their interest. `onMouseOver` will trigger even if the mouse is just passing over an element, whereas the `onMouseRest` composite event will trigger only after the user has lingered for a bit. The "mouse rest" composite event is a better solution than a simple `onMouseOver`.

Check out the docs for [`withMouseRest()`](src/mouse/#withmouserest) or the rest of the [API Docs](#api-docs).

## What is a Composite Event?

A "composite event" is an event for a component that is not part of its standard set of events, but is implemented in supplemental JavaScript code. It can be an event happening over time. In the case of DOM events, it can be a filter of existing DOM events.

Composite events were originally considered only in the context of DOM events. But with React Native and the proliferation of other non-DOM React environments, there are some composite events that do not assume a DOM environment (particularly the [generic composite events](generic/)).

A rather compelling and highly practical example is the "remain-in-state" DOM-related composite events. These allow handlers to be executed when a node remains in a specific event state for a specified amount of time (i.e. the user rests the mouse over a node for more than half a second).

## Benefits of Composite Events

Composite events offer the following key benefits...

### Encapsulation

Composite events allow sophisticated interactions with a component to be encapsulated into an implementation, so that the interaction can then be expressed as a single event.

Once a pattern of interaction is encapsulated into an implementation, you can then simply think of that interaction as its own event. The [What is a Composite Event?](#what-is-a-composite-event) section discusses the classic example of the "mouse rest" composite event, which encapsulates handling `onMouseOver`, `onMouseMove`, `onMouseOut`, and `onMouseDown` events of a DOM node, and also manages state for a timeout.

### Semantically Equivalent to Real Events

Composite events are semantically equivalent to actual events on a component. These events are "injected" into a component as props by wrapping it in a higher-order component (HOC).

This means that you can use them and think about them in your React apps as if they **were** actual events on a component. This also means that you can add handlers for composite events along with actual component events.

### Customizable Using Parameters

While a composite event itself doesn't take parameters, the HOC that creates it can accept parameters and produce different versions of the same "flavor" of composite event with slighly different behavior depending on the values supplied.

This may sound a little abstract, but what this means is that you can tune the behavior of a certain type of composite event through its parameters. Take the example of the "mouse rest" composite event. It lets you specify how long the mouse should be rested on a DOM node before the event is fired. This parameter makes this type of composite event more versatile than if it only supported one rest duration.

## API Docs

The Composite Event HOCs are grouped by domain:

- [**Base**](src/) - (advanced) the base HOC composer from which all other HOCs are built
- [**Generic**](src/generic/) - geneirc HOCs that create composite events intended to be environment-agnostic
- [**Mouse**](src/mouse/) - the HOCs that create composite events around DOM mouse events
- [**Key**](src/key/) - the HOCs that create composite events around DOM keyboard events

## Target Environments

TBD...

## Prior Art

`react-composite-events` is heavily inspired by the [`Uize.Dom.VirtualEvent`](https://github.com/UIZE/UIZE-JavaScript-Framework/blob/master/site-source/js/Uize/Dom/VirtualEvent.js) module that is a part of the open-source [UIZE JavaScript Framework](https://github.com/UIZE/UIZE-JavaScript-Framework). 

## Contributing

Contributions are welcome! See [Contributing Guidelines](CONTRIBUTING.md) for more details.

## Project philosophy

We take the stability of this utility package **very** seriously. `react-composite-events` follows the [SemVer](http://semver.org/) standard for versioning.

All updates must pass the [CI build](https://travis-ci.org/benmvp/react-composite-events) while maintaining [100% code coverage](https://coveralls.io/github/benmvp/react-composite-events).

## License

[MIT](LICENSE). Copyright (c) 2017 Ben Ilegbodu.
