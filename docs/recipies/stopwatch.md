# Stopwatch

[[toc]]

This is a simple stopwatch with configurable increment step, interval and maximum value limit.

<ClientOnly>
  <StopwatchDemo/>
</ClientOnly>

## Step-by-step

### Basics

First, let's define some basic reactive state for our stopwatch:

```js
import { useRxState } from 'vuse-rx';

// useRxState accepts an initial state for the system
const rxState = useRxState({
  // Determines if the stopwatch is counting
  count: false,

  // The smaller the speed,
  // the bigger the interval between increments
  speed: 5,

  // Actual stopwatch counter
  value: 0,

  // Maximum counter value, NaN means unlimited
  maxValue: NaN,

  // Step of the increment
  step: 1,
});
```

And some "business-rules":

```js
// A small utility to calculate the delay between increments
const calcDelay = state => 1000 / state.speed;

// Stopwatch is paused if it's not counting,
const paused = state => !state.count || state.step === 0 || (
  // or if the value has reached the maximum limit
  state.step > 0 && state.value >= state.maxValue
);

// Value must be capped by the maxValue
const clampValue = (maxValue, value) => ({
  maxValue,
  value: value > maxValue ? maxValue : value
});
```

### Reducers and counting logic

The next step would be to define reducers for our state.
These reducers contain atomic, pure state updates,
that are necessary for our business-logic to work.

Each reducer must return either a part of the state,
or an observable that emits a part of the state.

```js
// It's handy to wrap everything into a neat vue hook
// which encapsulates the whole functionality
const useStopwatch = () => rxState(
  // Reducers
  {
    // Play/Pause functionality
    setCountState: play => ({ count: play }),

    setStep: step => ({ step }),

    // Speed must be greater than zero
    setSpeed: speed => ({ speed: Math.max(1, speed) }),

    // Increment is done by steps, but the value cannot be incremented above the maximum
    increment: () => state => clampValue(state.maxValue, state.value + state.step),

    // Setting the value is limited by the maxValue
    setValue: value => state => clampValue(state.maxValue, value),

    // When setting the maxValue, we should also re-set the counter value,
    // in case it's above the new maximum
    setMaxValue: max => state => clampValue(max, state.value),
  },

  // Here we modify the resulting observable
  // by applying some of the reducers from above
  (state$, { increment }) => state$.pipe(
    switchMap(state =>
      paused(state)
        // if stopwatch is paused, proceed with no changes
        ? of(state)
        // otherwise - create a timer
        : timer(0, calcDelay(state)).pipe(
            mapTo(state),
            // that increments the state on each tick
            map(increment()),
          )
    ),
  )
);
```

### Component

Now that we have defined the inner workings of the stopwatch,
let's define how it's displayed to the user.

#### `setup` function

```vue {5,9-12,21,22}
<script>
// paste the code from earlier steps here

import { defineComponent, ref } from 'vue';
import { syncRef } from 'vuse-rx';

export default defineComponent({
  setup() {
    // Retrieve reducers and a fully reactive state
    const [handlers, state] = useStopwatch()
      // a shorthand to subscribe to our newly created observalble, neat!
      .subscribe(state => console.log('state updated: ', state));

    return {
      ...handlers,
      state,
      stepRef: ref(String(state.step)),
      setToRef: ref(String(state.value)),
      maxRef: ref(String(state.maxValue)),

      // update speedRef whenever the state.speed property changes
      speedRef: syncRef(state, 'speed', String),

      // override one of the handlers to interpret empty string as NaN instead of 0
      setMaxValue: maxRef => handlers.setMaxValue(maxRef === '' ? NaN : +maxRef),
    };
  },
});
</script>
```

#### `template`

```vue
<template>
  <div>
    <!-- Just a neat way to display the reactive state -->
    <p v-for="(value, key) in state" :key="key">{{key}}: {{value}}</p>
  </div>
  <div>
    <!-- Toggle counting state -->
    <button @click="setCountState(!state.count)">{{ state.count ? 'Pause' : 'Start' }}</button>

    <!-- Reset the counter value to 0 -->
    <button @click="setValue(0)">Reset</button>
  </div>
  <div>
    <!-- Toggle counting direction -->
    <button @click="setStep(-state.step)">Count {{ state.step > 0 ? 'down' : 'up' }}</button>
  </div>
  <div>
    <input v-model="setToRef"/>
    <!-- Convert ref's value to string and set it as the counter's value -->
    <!-- using the reducer that was defined earlier -->
    <button @click="setValue(+setToRef)">Set value</button>
  </div>
  <div>
    <!-- Convert speedRef value to string and set it as the counter's speed -->
    <!-- using the reducer that was defined earlier -->
    <input v-model="speedRef" @change="setSpeed(+speedRef)"/>

    <!-- Shorthand buttons to increment or decrement speed -->
    <button @click="setSpeed(+speedRef - 1)">-</button>
    <button @click="setSpeed(+speedRef + 1)">+</button>
    <!-- We don't need to assign the new speed to the ref -->
    <!-- because out speedRef is automatically synced to the reactive state.speed property! -->
  </div>
  <div>
    <input v-model="stepRef"/>
    <button @click="setStep(+stepRef)">Set step</button>
  </div>
  <div>
    <!-- Same thing as earlier, but for maxRef, -->
    <!-- with some workarounds to treat empty string as NaN -->
    <input v-model="maxRef"
      @keyup.enter="setMaxValue(maxRef)"
      @focus.capture="isNaN(maxRef) && (maxRef = '')"
      @blur.capture="maxRef = maxRef === '' || isNaN(maxRef) ? 'NaN' : maxRef"
    />
    <button @click="setMaxValue(maxRef)">Set maximum</button>
  </div>
</template>
```

## Complete component

Combining all the steps together, this is the complete stopwatch component:

```vue {5,28-34,51,52,57}
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { map, mapTo, switchMap, takeWhile } from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { useRxState, syncRef } from 'vuse-rx';

const rxState = useRxState({
  count: false,
  speed: 5,
  value: 0,
  maxValue: NaN,
  step: 1,
});

const calcDelay = state => 1000 / state.speed;

const paused = state => !state.count || state.step === 0 || (
  state.step > 0 && state.value >= state.maxValue
);

const clampValue = (maxValue, value) => ({
  maxValue,
  value: value > maxValue ? maxValue : value
});

const useStopwatch = () => rxState(
  {
    setCountState: play => ({ count: play }),
    setStep: step => ({ step }),
    setSpeed: speed => ({ speed: Math.max(1, speed) }),

    increment: () => state => clampValue(state.maxValue, state.value + state.step),
    setValue: value => state => clampValue(state.maxValue, value),
    setMaxValue: max => state => clampValue(max, state.value),
  },
  (state$, { increment }) => state$.pipe(
    switchMap(state =>
      paused(state)
        ? of(state)
        : timer(0, calcDelay(state)).pipe(
            mapTo(state),
            takeWhile(state => !paused(state)),
            map(increment()),
          )
    ),
  )
);

export default defineComponent({
  setup() {
    const [handlers, state] = useStopwatch()
      .subscribe(state => console.log('state updated: ', state));

    return {
      ...handlers,
      state,
      speedRef: syncRef(state, 'speed', String),
      stepRef: ref(String(state.step)),
      setToRef: ref(String(state.value)),
      maxRef: ref(String(state.maxValue)),

      setMaxValue: maxRef => handlers.setMaxValue(maxRef === '' ? NaN : +maxRef),
    };
  },
});
</script>

<template>
  <div>
    <p v-for="(value, key) in state" :key="key">{{key}}: {{value}}</p>
  </div>
  <div>
    <button @click="setCountState(!state.count)">{{ state.count ? 'Pause' : 'Start' }}</button>
    <button @click="setValue(0)">Reset</button>
  </div>
  <div>
    <button @click="setStep(-state.step)">Count {{ state.step > 0 ? 'down' : 'up' }}</button>
  </div>
  <div>
    <input v-model="setToRef"/>
    <button @click="setValue(+setToRef)">Set value</button>
  </div>
  <div>
    <input v-model="speedRef"/>
    <button @click="setSpeed(+speedRef - 1)">-</button>
    <button @click="setSpeed(+speedRef + 1)">+</button>
  </div>
  <div>
    <input v-model="stepRef"/>
    <button @click="setStep(+stepRef)">Set step</button>
  </div>
  <div>
    <input v-model="maxRef"
      @keyup.enter="setMaxValue(maxRef)"
      @focus.capture="isNaN(maxRef) && (maxRef = '')"
      @blur.capture="maxRef = maxRef === '' || isNaN(maxRef) ? 'NaN' : maxRef"
    />
    <button @click="setMaxValue(maxRef)">Set maximum</button>
  </div>
</template>
```

## Marble diagram

![stopwatch diagram](/stopwatch.png)