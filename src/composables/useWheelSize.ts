import { computed, ref, onMounted } from 'vue'

const MARGIN = 20

export function useWheelSize() {
  const style = ref<{ width: number }>({ width: 600 })
  const dimensions = ref({ width: 600, height: 600 })

  const updateDimensions = () => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth
      const width = Math.min(screenWidth, style.value.width) - MARGIN
      const height = Math.min(screenWidth, style.value.width) + 120

      dimensions.value = { width, height }
    }
  }

  onMounted(() => {
    updateDimensions()
  })

  const wheelSize = computed(() => dimensions.value)
  const wheelStyle = computed(() => ({
    width: `${wheelSize.value.width}px`,
    height: `${wheelSize.value.height}px`,
    margin: '0 auto',
    'will-change': 'transform',
    transform: 'translate3d(0,0,0)',
    'backface-visibility': 'hidden',
    'perspective': '1000px',
    'contain': 'layout paint',
    'isolation': 'isolate'
  }))

  return { wheelSize, wheelStyle }
}
