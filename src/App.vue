<template>
  <div class="wrap">
    <Wheel />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Wheel from './components/Wheel.vue'

export default defineComponent({
  name: 'App',
  components: {
    Wheel
  }
})
</script>

<style>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
