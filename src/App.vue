<template>
  <div class="wrap" @click="$refs.wheel.spin">
    <Wheel
      ref="wheel"
      :gift="gift"
      :data="data"
      @done="done"
      :imgParams="logo"
      :bgParams="background"
    />
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
      gift: 6,
      data: [
        {
          id: 1,
          value: "Gift 1",
          bgColor: "#7d7db3",
          color: "#ffffff",
        },
        {
          id: 2,
          value: "Gift 2",
          bgColor: "#ffffff",
          color: "#000000",
        },
        {
          id: 3,
          value: "Gift 3",
          bgColor: "#c92729",
          color: "#ffffff",
        },
        {
          id: 4,
          value: "Gift 4",
          bgColor: "#7d7db3",
          color: "#ffffff",
        },
        {
          id: 5,
          value: "Gift 5",
          bgColor: "#ffffff",
          color: "#000000",
        },
        {
          id: 6,
          value: "Gift 6",
          bgColor: "#c92729",
          color: "#ffffff",
        },
        {
          id: 7,
          value: "Gift 4",
          bgColor: "#7d7db3",
          color: "#ffffff",
        },
        {
          id: 8,
          value: "Gift 5",
          bgColor: "#ffffff",
          color: "#000000",
        },
        {
          id: 9,
          value: "Gift 6",
          bgColor: "#c92729",
          color: "#ffffff",
        },
        {
          id: 10,
          value: "Gift 10",
          bgColor: "#c92729",
          color: "#ffffff",
        },
        {
          id: 11,
          value: "Gift 1",
          bgColor: "#7d7db3",
          color: "#ffffff",
        },
        {
          id: 12,
          value: "Gift 2",
          bgColor: "#ffffff",
          color: "#000000",
        },
        {
          id: 13,
          value: "Gift 3",
          bgColor: "#c92729",
          color: "#ffffff",
        },
        {
          id: 14,
          value: "Gift 4",
          bgColor: "#7d7db3",
          color: "#ffffff",
        },
        {
          id: 15,
          value: "Gift 5",
          bgColor: "#ffffff",
          color: "#000000",
        },
        {
          id: 16,
          value: "Gift 6",
          bgColor: "#c92729",
          color: "#ffffff",
        },
        {
          id: 17,
          value: "Gift 4",
          bgColor: "#7d7db3",
          color: "#ffffff",
        },
        {
          id: 18,
          value: "Gift 5",
          bgColor: "#ffffff",
          color: "#000000",
        },
        {
          id: 19,
          value: "Gift 6",
          bgColor: "#c92729",
          color: "#ffffff",
        },
        {
          id: 20,
          value: "Gift 10",
          bgColor: "#c92729",
          color: "#ffffff",
        },
      ],
      logo: {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/2367px-Vue.js_Logo_2.svg.png",
        width: 100,
        height: 120,
      },
      background: {
        src: "https://i.imgur.com/n6IKigE.png",
        width: 600,
        height: 600,
      },
    };
  },
  methods: {
    done(r) {
      console.log(r);
    },
  },
});
</script>

<style>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
