import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSpin } from '../useSpin'
import { reactive } from 'vue'
import * as d3 from 'd3'

vi.mock('d3', () => ({
  select: vi.fn(),
  interpolate: vi.fn(),
  easeBackOut: {
    overshoot: vi.fn()
  }
}))

describe('useSpin', () => {
  const mockState = reactive({
    rotation: 0,
    vis: document.createElementNS('http://www.w3.org/2000/svg', 'g') // Create an SVGGElement instead of HTMLDivElement
  })

  const mockProps = {
    data: [
      { id: 1, value: 'Test 1', bgColor: '#000', color: '#fff' },
      { id: 2, value: 'Test 2', bgColor: '#fff', color: '#000' }
    ],
    animDuration: 1000,
    modelValue: 1
  }

  const mockEmit = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('spins the wheel correctly', async () => {
    const { spin } = useSpin(mockState, mockProps, mockEmit)

    const mockTransition = {
      duration: vi.fn().mockReturnThis(),
      ease: vi.fn().mockReturnThis(),
      attrTween: vi.fn().mockReturnThis(),
      end: vi.fn().mockResolvedValue(undefined)
    }

    const mockSelection = {
      transition: vi.fn().mockReturnValue(mockTransition)
    }

    vi.mocked(d3.select).mockReturnValue(mockSelection as any)
    vi.mocked(d3.interpolate).mockReturnValue(() => ({} as any)) // Return an object instead of a number
    vi.mocked(d3.easeBackOut.overshoot).mockReturnValue({ overshoot: () => 0 } as any) // Return an object with overshoot method

    await spin()

    expect(d3.select).toHaveBeenCalledWith(mockState.vis)
    expect(mockSelection.transition).toHaveBeenCalled()
    expect(mockTransition.duration).toHaveBeenCalledWith(1000)
    expect(mockTransition.ease).toHaveBeenCalled()
    expect(mockTransition.attrTween).toHaveBeenCalled()
    expect(mockEmit).toHaveBeenCalled()
  })

  it('does not spin if already spinning', async () => {
    const { spin } = useSpin(mockState, mockProps, mockEmit)

    // Mock d3.select for this test
    const mockSelection = {
      transition: vi.fn().mockReturnValue({
        duration: vi.fn().mockReturnThis(),
        ease: vi.fn().mockReturnThis(),
        attrTween: vi.fn().mockReturnThis(),
        end: vi.fn().mockResolvedValue(undefined)
      })
    }
    vi.mocked(d3.select).mockReturnValue(mockSelection as any)

    // First spin
    const firstSpinPromise = spin()

    // Try to spin again immediately
    await spin()

    // Wait for the first spin to complete
    await firstSpinPromise

    // d3.select should only be called once for the first spin
    expect(d3.select).toHaveBeenCalledTimes(1)
  })
})
