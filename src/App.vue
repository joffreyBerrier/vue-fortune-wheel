<template>
  <div class="wrap" @click="launchWheel">
    <Wheel
      ref="wheel"
      :gift="gift"
      :data="data"
      @done="done"
      :imgParams="logo"
    />
  </div>
</template>

<script lang="ts">
import { Datas, imgParams } from "../types/index";
import { defineComponent, ref, Ref } from "vue";

import Wheel from "./components/Wheel.vue";

export default defineComponent({
  setup() {
    const wheel = ref(null);
    const data: Ref<Datas> = ref([
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
    ]);
    const logo: imgParams = {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/2367px-Vue.js_Logo_2.svg.png",
      width: 100,
      height: 120,
    };

    const done = (r: Datas) => {
      console.log("done", r);
    };

    const launchWheel = () => {
      wheel.value.spin();
    };

    return {
      data,
      done,
      gift: 5,
      launchWheel,
      logo,
      wheel,
    };
  },
  components: {
    Wheel,
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
