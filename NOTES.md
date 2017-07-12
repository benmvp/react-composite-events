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
  * `eventName`
  * `triggerEvent`
  * `duration` (milliseconds)
    - `<= 0` - no time
    - `> 0` - time
    - `Infinity` - no end
  * `cancelEvent`
  * `triggersResetTime`
  * `allowRefire`

- `addCompositeEvents`
  * array of composite event info objects


### Helpers

press/index.js
- `addLongPress`
- `addRemainPressed(duration)`
- `addRemainUnpressed(duration)`

mouseMove/index.js
- `addMouseRemainOut(duration)`
- `addMouseRemainOver(duration)`
- `addMouseRest(duration)`

keyboard/index.js
- `addKeyRemainDown(duration)`
- `addKeyRemainUp(duration)`

yyy/index.js
- `addRemainBlurred(duration)`
- `addRemainFocused(duration)`

dom/mouseMove/index.js
- `addMouseEnterLeft`
- `addMouseEnterRight`
- `addMouseEnterTop`
- `addMouseEnterBottom`
- `addMouseExitLeft`
- `addMouseExitRight`
- `addMouseExitTop`
- `addMouseExitBottom`

dom/modKey/index.js
- `addModifierKeyEvent(modifierKeys, mouseEvent)`
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

count/index.js
- `addFirstActionEvent(eventName)`
- `addRepeatActionEvent(eventName, times, maxInterval)`
- `addFirstPress`
- `addRepeatPress(times, maxInterval)`
