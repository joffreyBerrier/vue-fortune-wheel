<script setup lang="ts">
import { ref } from 'vue'
import { FortuneWheel } from './index'

import type { Data, ImgParams } from '@/types'

const gift = ref(2)
const wheel = ref<InstanceType<typeof FortuneWheel> | null>(null)
const data = ref<Data[]>([
  {
    id: 1,
    value: 'Gift 1',
    bgColor: '#7d7db3',
    color: '#ffffff'
  },
  {
    id: 2,
    value: 'Gift 2',
    bgColor: '#ffffff',
    color: '#000000'
  },
  {
    id: 3,
    value: 'Gift 3',
    bgColor: '#c92729',
    color: '#ffffff'
  },
  {
    id: 4,
    value: 'Gift 4',
    bgColor: '#7d7db3',
    color: '#ffffff'
  },
  {
    id: 5,
    bgColor: '#ffffff',
    color: '#000000',
    value: 'Gift 5'
  },
])
const logo: ImgParams = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/2367px-Vue.js_Logo_2.svg.png',
  width: 100,
  height: 120
}

const done = (r: Data) => {
  console.log('done', r)
}

const launchWheel = () => {
  if (wheel.value) wheel.value.spin()
}

const defineModelValue = (value: number) => {
  gift.value = value
}

const addSomeData = () => {
  data.value.push({
    id: 7,
    value: 'Gift 7',
    bgColor: '#7d7db3',
    color: '#ffffff'
  })
}
</script>

<template>
  <button @click="defineModelValue(4)">Define modelValue to 4</button>
  <button @click="addSomeData">Add some data</button>
  
  <p>ModelValue: {{ gift }}</p>

  <div class="wrap" @click="launchWheel">
    <FortuneWheel
      ref="wheel"
      v-model="gift"
      :middle-circle="true"
      font-family="Roboto, sans-serif"
      :auto-spin="true"
      debug
      :imgParams="logo"
      :data="data"
      @done="done"
    />
  </div>
</template>

<style>
.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
