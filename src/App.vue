<template>
  <div class="wrap" @click="$refs.wheel.spin">
    <Wheel ref="wheel" :gift="gift" :data="data" @done="done" :imgParams="logo"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Wheel from "./components/Wheel.vue";

export default defineComponent({
  name: "App",
  components: {
    Wheel,
  },
  data() {
    return {
      gift: 5,
      data: [
        {
          id: 1,
          value: "Fish and Chips",
          bgColor: '#7d7db3',
          color: '#ffffff'
        },
        {
          id: 2,
          value: "M in Black Burger",
          bgColor: '#ffffff',
          color: '#000000'
        },
        {
          id: 3,
          value: "Pack de 3 bières",
          bgColor: '#c92729',
          color: '#ffffff'
        },
        {
          id: 4,
          value: "Fish Balls x6",
          bgColor: '#7d7db3',
          color: '#ffffff'
        },
        {
          id: 5,
          value: "Jus de fruits",
          bgColor: '#ffffff',
          color: '#000000'
        },
        {
          id: 6,
          value: "Dessert maison",
          bgColor: '#c92729',
          color: '#ffffff'
        },
      ],
      logo: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/2367px-Vue.js_Logo_2.svg.png',
        width: 100,
        height: 120
      }
    };
  },
  methods: {
    done(r) {
      console.log(r)
    }
  }
});
</script>

<style>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
