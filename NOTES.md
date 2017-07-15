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

- `addCompositeEvent`
  * `eventPropName`
  * `triggerEvent`
  * `duration` (milliseconds)
    - `<= 0` - no time
    - `> 0` - time
    - `Infinity` - no end
  * `cancelEvent`
  * `triggersResetTime`
  * `allowRefire`
  * `beforeCallback`
    - called before calling the actual event handler

- `addCompositeEvents`
  * array of composite event info objects


### Helpers

input/index.js
- `addLongPress`
- `addRemainPressed(duration)`
- `addRemainUnpressed(duration)`
- `addRemainBlurred(duration)`
- `addRemainFocused(duration)`

- `addFirstActionEvent(eventName)`
- `addRepeatActionEvent(eventName, times, maxInterval)`
- `addFirstPress`
- `addRepeatPress(times, maxInterval)`

mouse/index.js
- `addMouseRemainOut(duration)`
- `addMouseRemainOver(duration)`
- `addMouseRest(duration)`

- `addMouseEnterLeft`
- `addMouseEnterRight`
- `addMouseEnterTop`
- `addMouseEnterBottom`
- `addMouseExitLeft`
- `addMouseExitRight`
- `addMouseExitTop`
- `addMouseExitBottom`

- `addModifierKeyMouseEvent(modifierKeys, mouseEvent)`
- `addAltClick`
- `addCtrlClick`
- `addMetaClick`
- `addShiftClick`
- `addShiftAltClick`
- `addShiftCtrlClick`
- `addShiftMetaClick`
- `addMetaAltClick`
- `addMetaCtrlClick`
- `addAltCtrlClick`
- `addShiftAltMetaClick`
- ...

key/index.js
- `addKeyRemainUp(duration)`
- `addKeyRemainDown(duration)`
- `addKeyPress(keyName)`
- `addKeyDown(keyName)`
