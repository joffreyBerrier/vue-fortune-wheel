<template>
  <div class="wrap" @click="$refs.wheel.spin">
    <Wheel ref="wheel" v-model="gift" :data="data" @done="done" :imgParams="logo"/>
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
          value: "Fish and Chips",
          id: 1,
          color: '#7d7db3'
        },
        {
          value: "M in Black Burger",
          id: 2,
          color: '#ffffff'
        },
        {
          value: "Pack de 3 bières",
          id: 3,
          color: '#c92729'
        },
        {
          value: "Fish Balls x6",
          id: 4,
          color: '#7d7db3'
        },
        {
          value: "Jus de fruits",
          id: 5,
          color: '#ffffff'
        },
        {
          value: "Dessert maison",
          id: 6,
          color: '#c92729'
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
