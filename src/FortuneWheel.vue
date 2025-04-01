<script setup lang="ts">
import { watch, onMounted, onUnmounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { Data, ImgParams } from '@/types'
import { useWheelSize } from './composables/useWheelSize'
import { useWheelCreation } from './composables/useWheelCreation'
import { useSpin } from './composables/useSpin'

export type WheelProps = {
  data: Data[]
  middleCircle?: boolean
  imgParams?: ImgParams
  fontFamily?: string
  animDuration?: number
  autoSpin?: boolean
  debug?: boolean
  modelValue?: number
}

const props = withDefaults(defineProps<WheelProps>(), {
  animDuration: 6000,
  autoSpin: false,
  debug: false,
  modelValue: 0,
  middleCircle: true,
  fontFamily: 'Arial, sans-serif',
  imgParams: () => ({ src: '', width: 0, height: 0 })
})

const emit = defineEmits<{
  (e: 'done', value: Data): void
  (e: 'update:modelValue', value: number): void
}>()

const isMobile = computed(() => window.innerWidth <= 768)

const { wheelSize, wheelStyle } = useWheelSize()
const { state, createWheel, redrawWheel, cleanup } = useWheelCreation(props, wheelSize, isMobile)
const { spin } = useSpin(state, props, emit)

const debouncedRedrawWheel = useDebounceFn(redrawWheel, 250)

watch(() => props.data, debouncedRedrawWheel, { 
  deep: true,
  flush: 'post'
})

watch(() => props.modelValue, (newValue, oldValue) => {
  if (props.autoSpin && newValue !== oldValue && !state.isSpinning) {
    spin()
  }
})

onMounted(() => {
  state.rayon = Math.min(wheelSize.value.width, wheelSize.value.height) / 2
  createWheel()
})

onUnmounted(() => {
  cleanup()
})

defineExpose({ spin, state })
</script>

<template>
  <template v-if="debug && (state.error || state.isRendering)">
    <div class="debug-container">
      <div v-if="state.error">
        {{ state.error }}
      </div>
      <div v-if="state.isRendering">
        Chargement...
      </div>
    </div>
  </template>

  <div
    id="wheel" 
    class="wheel" 
    :style="wheelStyle as any" 
    role="img" 
    aria-label="Fortune Wheel"
  />
</template>

<style scoped>
.debug-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  z-index: 1000;
  max-width: 300px;
  font-size: 12px;
}
</style>