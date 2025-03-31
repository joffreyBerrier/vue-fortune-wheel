<script setup lang="ts">
import { watch, onMounted, reactive } from 'vue'
import * as d3 from 'd3'
import type { Arc, Pie } from 'd3'
import type { Data, ImgParams } from '@/types'
import { useWheelSize } from './composables/useWheelSize'
import { useWheelCreation } from './composables/useWheelCreation'
import { useSpin } from './composables/useSpin'

interface Props {
  data: Data[]
  animDuration?: number
  modelValue?: number
  imgParams?: ImgParams
  middleCircle?: boolean
  autoSpin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animDuration: 6000,
  modelValue: 0,
  middleCircle: true,
  imgParams: () => ({ src: '', width: 0, height: 0 }),
  autoSpin: false
})

const emit = defineEmits<{
  (e: 'done', value: Data): void
  (e: 'update:modelValue', value: number): void
}>()

const state = reactive({
  pieGenerator: null as Pie<any, Data> | null,
  arcGenerator: null as Arc<any, d3.PieArcDatum<Data>> | null,
  arrow: null as SVGElement | null,
  container: null as SVGGElement | null,
  rayon: 0,
  rotation: 0,
  isSpinning: false,
  svg: null as SVGGElement | null,
  vis: null as SVGGElement | null
})
  
const { wheelSize, wheelStyle } = useWheelSize(props)
const { createWheel, redrawWheel } = useWheelCreation(state, props, wheelSize)
const { spin } = useSpin(state, props, emit)

watch(() => props.data, redrawWheel, { deep: true })
watch(() => props.modelValue, (newValue, oldValue) => {
  if (props.autoSpin && newValue !== oldValue) {
    spin()
  }
})

onMounted(() => {
  state.rayon = Math.min(wheelSize.value.width, wheelSize.value.height) / 2
  createWheel()
})

defineExpose({ spin })
</script>

<template>
  <div id="wheel" class="wheel" :style="wheelStyle" role="img" aria-label="Fortune Wheel" />
</template>
