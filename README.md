# vue-wheel

👊 An easier Wheel in Vue.js 👊

🔥 Vue3 + Typescript 🔥

## Installation

#### NPM / YARN

Install the package:

```
npm install vue-wheel --save
yarn add vue-wheel
```

```javascript
import VueWheel from 'vue-wheel'

export default {
  components: {
    VueWheel,
  },
}
```

```html
<vue-wheel />
```

## Data binding

### Gift
- Type: `Number`
- Default: `null`

id of the gain / gift


## Props/Options

### animDuration
- Type: `Number`
- Default: `5000`

How many millisecondes you want the wheel to turn

### Colors

- Type: `Array`
- Default: `[]`

Array of colors you want to display on your wheel

#### Example :

```javacript
  ["#7d7db3", "#ffffff", "#c92729"]
```

### Data

- Type: `Array`
- Default: `[]`

* value: `string`
* id: `number`

#### Example :

```javascript
data: [
  {
    value: "Gift 1",
    id: 1,
  },
  {
    value: "Gift 2",
    id: 2,
  },
  {
    value: "Gift 3",
    id: 3,
  },
  {
    value: "Gift 4",
    id: 4,
  },
  {
    value: "Gift 5",
    id: 5,
  },
],
```
