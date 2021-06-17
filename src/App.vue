<template>
  <div class="wrap">
    <Wheel ref="wheel" v-model="gift" :data="data" :colors="colors" @done="done" />
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
      colors: ["#7d7db3", "#ffffff", "#c92729"],
      data: [
        {
          value: "Fish and Chips",
          id: 1,
        },
        {
          value: "M in Black Burger",
          id: 2,
        },
        {
          value: "Pack de 3 bières",
          id: 3,
        },
        {
          value: "Fish Balls x6",
          id: 4,
        },
        {
          value: "Jus de fruits",
          id: 5,
        },
        {
          value: "Dessert maison",
          id: 6,
        },
      ],
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
