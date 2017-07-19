# NOTES

## Sample end-user-experience

```js
import {addMouseRemainOver} from 'react-composite-events/mouseMove'

const FancyDiv = addMouseRemainOver(500)('div')

const MyComponent = ({onMouseRemainOver}) => (
    <FancyDiv onMouseRemainOver-500={onMouseRemainOver} />
)
```

## Files

### Entry

index.js

- `compose`
  - `eventPropName`
  - `triggerEvent`
  - `defaultDuration` (milliseconds)
    - `<= 0` - no time
    - `> 0` - time
    - ~~`Infinity` - no end~~
  - `cancelEvent`
  - `shouldResetTimerOnRetrigger`
  - `allowRefire`
  - `beforeCallback`
    - called before calling the actual event handler

- ~~`composeMulti`~~
  - array of composite event info objects

### Helpers

input/index.js

- ~~`withLongPress`~~
- `withRemainPressed(duration)`
- `withRemainUnpressed(duration)`
- `withRemainBlurred(duration)`
- `withRemainFocused(duration)`

- `composeFirstAction(eventName)`
- `composeRepeatAction(eventName, times, maxInterval)`
- `withFirstPress`
- `withRepeatPress(times, maxInterval)`

mouse/index.js

- `withMouseRemainOut(duration)`
- `withMouseRemainOver(duration)`
- `withMouseRest(duration)`

- `withMouseEnterLeft`
- `withMouseEnterRight`
- `withMouseEnterTop`
- `withMouseEnterBottom`
- `withMouseExitLeft`
- `withMouseExitRight`
- `withMouseExitTop`
- `withMouseExitBottom`

- `composeMouseModifierKey(modifierKeys, mouseEvent)`
- `withAltClick`
- `withCtrlClick`
- `withMetaClick`
- `withShiftClick`
- `withShiftAltClick`
- `withShiftCtrlClick`
- `withShiftMetaClick`
- `withMetaAltClick`
- `withMetaCtrlClick`
- `withAltCtrlClick`
- `withShiftAltMetaClick`
- ...

key/index.js

- `withKeyRemainUp(duration)`
- `withKeyRemainDown(duration)`
- `withKeyPress(keyName)`
- `withKeyDown(keyName)`
