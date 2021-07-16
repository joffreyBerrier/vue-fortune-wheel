# vue3-fortune-wheel

👊 An easier fortune-wheel in Vue.js 👊

🔥 Vue3 + Typescript 🔥

# Sandbox example

_Open this link on a new tab_

[![Edit vue-wheel](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-wheel-rjgn0?fontsize=14&theme=dark&view=preview)

## Installation

#### NPM / YARN

Install the package:

```
npm install vue3-fortune-wheel --save
yarn add vue3-fortune-wheel
```

```javascript
import { Wheel } from "vue3-fortune-wheel";
import "vue3-fortune-wheel/style";

export default {
  components: {
    Wheel,
  },
};
```

```html
<Wheel />
```

## Props/Options

### Gift

- Type: `Number`
- Default: `null`

This data corresponds to the id of your winning object. In my case an API returns me the id.
If you are not in this case you can create a method that randomly chooses an id

Exemple of this method

```javascript
randomGift() {
  return Math.floor(Math.random() * this.data.lengh) + 1
}
```

### animDuration

- Type: `Number`
- Default: `5000`

How many millisecondes you want the wheel to turn

### Data

- Type: `Array`
- Default: `[]`

* id: `number`
* value: `string`
* color: `string`
* bgColor: `string`

#### Example :

```javascript
data: [
  {
    id: 1,
    value: "Gift 1",
    color: '#7d7db3',
    bgColor: '#ffffff'
  },
  {
    id: 2,
    value: "Gift 2",
    color: '#ffffff',
    bgColor: '#ffffff'
  },
  {
    id: 3,
    value: "Gift 3",
    color: '#c92729',
    bgColor: '#ffffff'
  },
],
```

### ImgParams

- Type: `Object`
- Default: `{}`

Possible to add an image in the center

#### Example :

```javacript
  {
    src: string
    width: number
    height: number
  }
```
