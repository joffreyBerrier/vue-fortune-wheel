import { describe, it, beforeEach, expect, vi } from 'vitest'
import { useWheelCreation } from '../useWheelCreation'
import { reactive, computed } from 'vue'

describe('useWheelCreation', () => {
  const mockState = reactive({
    pieGenerator: null,
    arcGenerator: null,
    arrow: null,
    container: null,
    rayon: 100,
    svg: null,
    vis: null
  })

  const mockProps = {
    data: [{ id: 1, value: 'Test', bgColor: '#000', color: '#fff' }],
    middleCircle: true,
    imgParams: { src: 'test.jpg', width: 50, height: 50 }
  }

  const mockWheelSize = computed(() => ({ width: 200, height: 200 }))

  beforeEach(() => {
    vi.resetAllMocks()
    document.body.innerHTML = '<div id="wheel"></div>'
  })

  it('creates wheel correctly', () => {
    const { createWheel } = useWheelCreation(mockState, mockProps, mockWheelSize)

    createWheel()

    expect(mockState.pieGenerator).not.toBeNull()
    expect(mockState.arcGenerator).not.toBeNull()

    expect(mockState.arrow).toBeInstanceOf(SVGElement)
    expect(mockState.container).toBeInstanceOf(SVGElement)
    expect(mockState.svg).toBeInstanceOf(SVGElement)
    expect(mockState.vis).toBeInstanceOf(SVGElement)
  })

  it('redraws wheel when called', () => {
    const { redrawWheel } = useWheelCreation(mockState, mockProps, mockWheelSize)
    redrawWheel()

    expect(mockState.pieGenerator).not.toBeNull()
    expect(mockState.arcGenerator).not.toBeNull()

    expect(mockState.arrow).toBeInstanceOf(SVGElement)
    expect(mockState.container).toBeInstanceOf(SVGElement)
    expect(mockState.svg).toBeInstanceOf(SVGElement)
    expect(mockState.vis).toBeInstanceOf(SVGElement)
  })
})
