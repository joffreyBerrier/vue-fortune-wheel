# vue3-fortune-wheel v2.0.0

👊 An easy-to-use fortune wheel component for Vue.js 3 👊

🔥 Built with Vue 3 + TypeScript 🔥

## Features

- Customizable wheel segments
- Animated spinning
- Optional center image
- TypeScript support
- Accessible (with ARIA attributes)

## Installation

```bash
pnpm add vue3-fortune-wheel
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FortuneWheel } from 'vue3-fortune-wheel'
import type { Data, ImgParams } from 'vue3-fortune-wheel'

const gift = ref(2)
const wheel = ref<InstanceType<typeof FortuneWheel> | null>(null)
const data = ref<Data[]>([
  { id: 1, value: 'Gift 1', bgColor: '#7d7db3', color: '#ffffff' },
  { id: 2, value: 'Gift 2', bgColor: '#ffffff', color: '#000000' }
])

// Optional: Center image
const logo: ImgParams = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/2367px-Vue.js_Logo_2.svg.png',
  width: 100,
  height: 120
}

const hasMiddleCircle = true

const done = (result: Data) => {
  console.log('Spin completed:', result)
}
</script>

<template>
  <FortuneWheel
    ref="wheel"
    v-model="gift"
    :middle-circle="hasMiddleCircle"
    :img-params="logo"
    :data="data"
    @done="done"
  />
</template>
```

## API

### Props

| Prop         | Type        | Default | Description                               |
| ------------ | ----------- | ------- | ----------------------------------------- |
| v-model      | `number`    | `null`  | ID of the winning item                    |
| data         | `Data[]`    | `[]`    | Array of wheel segments                   |
| animDuration | `number`    | `5000`  | Spin animation duration in milliseconds   |
| imgParams    | `ImgParams` | `{}`    | Configuration for center image (optional) |
| middleCircle | `boolean`   | `true`  | Show/hide middle circle                   |

### Events

| Event | Payload | Description                        |
| ----- | ------- | ---------------------------------- |
| done  | `Data`  | Emitted when the spin is completed |

### Methods

| Method | Description           |
| ------ | --------------------- |
| spin() | Starts the wheel spin |

## Types

```typescript
interface Data {
  id: number
  value: string
  color: string
  bgColor: string
}

interface ImgParams {
  src: string
  width: number
  height: number
}
```

## Spinning the Wheel

Use the `ref` to call the `spin` method:

```typescript
const wheel = ref<InstanceType<typeof FortuneWheel> | null>(null)

const launchWheel = () => {
  wheel.value?.spin()
}
```

## Customization

### Random Winner Selection

If you need to randomly select a winner, you can use a method like this:

```typescript
const randomGift = () => {
  return Math.floor(Math.random() * data.value.length) + 1
}
```

## Development

### Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/vue3-fortune-wheel.git`
3. Install dependencies: `pnpm install`

### Running Tests

```bash
pnpm run test:unit
```

### Contributing

1. Create an issue describing the feature or bug
2. Fork the repo and create a branch following the gitflow convention:
   - Feature branches: `feature/issueId`
   - Release branches: `release/issueId`
   - Hotfix branches: `hotfix/issueId`
   - Support branches: `support/issueId`
3. Make your changes and push to your fork
4. Open a pull request to the main repository

## License

[MIT License](LICENSE)

## Support

If you have any questions or need help, please open an issue on the GitHub repository.

---

Made with ❤️ by Joffrey Berrier
