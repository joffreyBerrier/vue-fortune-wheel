import { ref } from 'vue'
import * as d3 from 'd3'
import type { Data } from '@/types'

const FULL_CIRCLE = 360
const ROTATIONS = 5

interface Props {
  data: Data[]
  animDuration: number
  modelValue: number
}

interface State {
  rotation: number
  vis: SVGGElement | null
}

interface Emits {
  (e: 'done', value: Data): void
}

export function useSpin(state: State, props: Props, emit: Emits) {
  const isSpinning = ref(false)

  const findCurrentSlice = (index: number): number => {
    if (props.data.length === 0) return 0
    return props.data.findIndex((x) => x.id === index) + 1
  }

  const spin = async (): Promise<void> => {
    if (isSpinning.value) return

    isSpinning.value = true

    try {
      const dataLength = props.data.length
      const sliceWidth = FULL_CIRCLE / dataLength
      const slicedGift = findCurrentSlice(props.modelValue)
      const currentAngle = FULL_CIRCLE - sliceWidth * (slicedGift - 1)
      const numberOfRotation = FULL_CIRCLE * ROTATIONS
      const r = currentAngle + numberOfRotation

      state.rotation = Math.round(r / sliceWidth) * sliceWidth

      let picked = Math.round(dataLength - (state.rotation % FULL_CIRCLE) / sliceWidth)
      picked = picked >= dataLength ? picked % dataLength : picked

      // Center slice
      const sliceSize = sliceWidth + sliceWidth / 2
      state.rotation += sliceSize - Math.round(sliceWidth * 2)

      const interpolate = d3.interpolate(0, state.rotation)

      if (state.vis) {
        await d3
          .select(state.vis)
          .transition()
          .duration(props.animDuration)
          .ease(d3.easeBackOut.overshoot(0.3))
          .attrTween('transform', () => (t) => `rotate(${interpolate(t)})`)
          .end()
      }

      emit('done', props.data[picked])
    } catch (error) {
      console.error('Error spinning the wheel:', error)
    } finally {
      isSpinning.value = false
    }
  }

  return { spin }
}
