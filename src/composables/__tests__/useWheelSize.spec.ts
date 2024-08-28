import { describe, it, expect, beforeAll, vi } from 'vitest'
import { useWheelSize } from '../useWheelSize'

describe('useWheelSize', () => {
  const mockProps = {
    data: [{ id: 1, value: 'Test', bgColor: '#000', color: '#fff' }],
    imgParams: { src: '', width: 0, height: 0 }
  }

  beforeAll(() => {
    vi.stubGlobal('innerWidth', 1024)
    vi.stubGlobal('innerHeight', 768)
  })

  it('calculates wheel size correctly', () => {
    const { wheelSize } = useWheelSize(mockProps)
    expect(wheelSize.value.width).toBe(580)
    expect(wheelSize.value.height).toBe(720)
  })

  it('calculates font size correctly based on data length', () => {
    const { fontSize } = useWheelSize(mockProps)
    expect(fontSize.value).toBe(16)

    const manyDataProps = { ...mockProps, data: new Array(10).fill(mockProps.data[0]) }
    const { fontSize: manyDataFontSize } = useWheelSize(manyDataProps)
    expect(manyDataFontSize.value).toBe(10)
  })

  it('generates correct wheel style', () => {
    const { wheelStyle } = useWheelSize(mockProps)
    expect(wheelStyle.value).toEqual({
      width: '580px',
      height: '720px',
      fontSize: '16px',
      margin: '0 auto'
    })
  })
})
