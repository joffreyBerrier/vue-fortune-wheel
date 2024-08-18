import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FortuneWheel from '../FortuneWheel.vue'

describe('FortuneWheel', () => {
  const mockData = [
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
    }
  ]

  it('renders correctly with default props', async () => {
    const wrapper = mount(FortuneWheel, {
      props: {
        data: mockData
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders correctly with middleCircle prop set to false', async () => {
    const wrapper = mount(FortuneWheel, {
      props: {
        data: mockData,
        middleCircle: false
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('updates correctly when data changes', async () => {
    const wrapper = mount(FortuneWheel, {
      props: {
        data: mockData
      }
    })
    await wrapper.vm.$nextTick()

    const newData = [
      ...mockData,
      {
        id: 4,
        value: 'Gift 4',
        bgColor: '#7d7db3',
        color: '#ffffff'
      }
    ]
    await wrapper.setProps({ data: newData })
    await wrapper.vm.$nextTick()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('computes wheel size correctly', async () => {
    const wrapper = mount(FortuneWheel, {
      props: {
        data: mockData
      }
    })
    await wrapper.vm.$nextTick()
    const wheelStyle = (wrapper.vm as any).wheelStyle

    const windowWidth = window.innerWidth
    const width = Math.min(windowWidth, 600) - 20
    const height = Math.min(windowWidth, 600) + 120

    expect(windowWidth).toBe(1024)
    expect(wheelStyle.width).toBe(`${width}px`)
    expect(wheelStyle.height).toBe(`${height}px`)
  })

  it('emits "done" event when spin is called', async () => {
    const wrapper = mount(FortuneWheel, {
      props: {
        data: mockData
      }
    })
    await wrapper.vm.spin()
    expect(wrapper.emitted('done')).toBeTruthy()
    expect(wrapper.emitted('done')?.[0]).toBeTruthy()
  })

  it('applies correct background colors', async () => {
    const wrapper = mount(FortuneWheel, {
      props: { data: mockData }
    })
    await wrapper.vm.$nextTick()
    const slices = wrapper.findAll('.slice')
    slices.forEach((slice, index) => {
      expect(slice.attributes('fill')).toBe(mockData[index].bgColor)
    })
  })

  it('selects correct slice after spin', async () => {
    const wrapper = mount(FortuneWheel, {
      props: { data: mockData, modelValue: 2 }
    })
    await wrapper.vm.spin()
    const emitted = wrapper.emitted('done') as any[]
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toEqual(mockData[1])
  })

  it('handles empty data gracefully', async () => {
    const wrapper = mount(FortuneWheel, {
      props: { data: [] }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders large datasets without significant delay', async () => {
    const largeDataset = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      value: `Prize ${i}`,
      bgColor: '#000000',
      color: '#ffffff'
    }))
    const start = performance.now()
    const wrapper = mount(FortuneWheel, {
      props: { data: largeDataset }
    })
    await wrapper.vm.$nextTick()
    const end = performance.now()
    expect(end - start).toBeLessThan(1000)
  })
})
