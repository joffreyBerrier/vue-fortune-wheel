import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FortuneWheel from './FortuneWheel.vue'
import type { Data } from './types'

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 0
  })

  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  })

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  })

  document.body.innerHTML = ''
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('FortuneWheel - Text Rendering', () => {
  const createTestData = (count: number): Data[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      value: `Gift ${i + 1}`,
      bgColor: i % 2 === 0 ? '#7d7db3' : '#ffffff',
      color: i % 2 === 0 ? '#ffffff' : '#000000'
    }))
  }

  const getHiddenArcs = (wrapper: ReturnType<typeof mount>) => {
    const container = wrapper.element
    const hiddenArcs = container.querySelectorAll('.hiddenarcs')
    return Array.from(hiddenArcs).map(arc => ({
      id: arc.getAttribute('id'),
      d: arc.getAttribute('d')
    }))
  }

  const getTextPaths = (wrapper: ReturnType<typeof mount>) => {
    const container = wrapper.element
    const textElements = container.querySelectorAll('.middleArcText')
    return Array.from(textElements).map(text => {
      const textPath = text.querySelector('textPath')
      return {
        dy: text.getAttribute('dy'),
        href: textPath?.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || textPath?.getAttribute('href'),
        text: textPath?.textContent || ''
      }
    })
  }

  const validateArcPath = (d: string | undefined, index: number) => {
    expect(d).toBeDefined()
    expect(d).not.toBe('')
    expect(d).toMatch(/^M/)
    expect(d).toContain('A')
    expect(d).not.toMatch(/MA[0-9]/)
    expect(d).not.toMatch(/00[0-9]/)
  }

  it('should render 2 sections with valid arc paths and visible text', async () => {
    const data = createTestData(2)
    const wrapper = mount(FortuneWheel, {
      props: {
        data,
        modelValue: 1,
        debug: true
      },
      attachTo: document.body
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 300))

    const hiddenArcs = getHiddenArcs(wrapper)
    const textPaths = getTextPaths(wrapper)

    expect(hiddenArcs).toHaveLength(2)

    hiddenArcs.forEach((arc, i) => {
      expect(arc.id).toBe(`middleArc${i}`)
      validateArcPath(arc.d, i)
    })

    expect(textPaths).toHaveLength(2)

    expect(textPaths[0].dy).toBe('40')
    expect(textPaths[1].dy).toBe('-40')

    expect(textPaths[0].href).toBe('#middleArc0')
    expect(textPaths[0].text).toBe('Gift 1')
    expect(textPaths[1].href).toBe('#middleArc1')
    expect(textPaths[1].text).toBe('Gift 2')

    const svg = wrapper.find('svg')
    expect(svg.html()).toMatchSnapshot()
  })

  it('should render 3 sections with valid arc paths and visible text', async () => {
    const data = createTestData(3)
    const wrapper = mount(FortuneWheel, {
      props: {
        data,
        modelValue: 1,
        debug: true
      },
      attachTo: document.body
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 300))

    const hiddenArcs = getHiddenArcs(wrapper)
    const textPaths = getTextPaths(wrapper)

    expect(hiddenArcs).toHaveLength(3)
    expect(textPaths).toHaveLength(3)

    hiddenArcs.forEach((arc, i) => {
      expect(arc.id).toBe(`middleArc${i}`)
      validateArcPath(arc.d, i)
    })

    textPaths.forEach((text, i) => {
      expect(text.href).toBe(`#middleArc${i}`)
      expect(text.text).toBe(`Gift ${i + 1}`)
      expect(text.dy).toMatch(/^-?40$/)
    })

    const svg = wrapper.find('svg')
    expect(svg.html()).toMatchSnapshot()
  })

  it('should render 4 sections with valid arc paths and visible text', async () => {
    const data = createTestData(4)
    const wrapper = mount(FortuneWheel, {
      props: {
        data,
        modelValue: 1,
        debug: true
      },
      attachTo: document.body
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 300))

    const hiddenArcs = getHiddenArcs(wrapper)
    const textPaths = getTextPaths(wrapper)

    expect(hiddenArcs).toHaveLength(4)
    expect(textPaths).toHaveLength(4)

    hiddenArcs.forEach((arc, i) => {
      expect(arc.id).toBe(`middleArc${i}`)
      validateArcPath(arc.d, i)
    })

    textPaths.forEach((text, i) => {
      expect(text.href).toBe(`#middleArc${i}`)
      expect(text.text).toBe(`Gift ${i + 1}`)
      expect(text.dy).toMatch(/^-?40$/)
    })

    const svg = wrapper.find('svg')
    expect(svg.html()).toMatchSnapshot()
  })

  it('should render 5 sections with valid arc paths and visible text', async () => {
    const data = createTestData(5)
    const wrapper = mount(FortuneWheel, {
      props: {
        data,
        modelValue: 1,
        debug: true
      },
      attachTo: document.body
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 300))

    const hiddenArcs = getHiddenArcs(wrapper)
    const textPaths = getTextPaths(wrapper)

    expect(hiddenArcs).toHaveLength(5)
    expect(textPaths).toHaveLength(5)

    hiddenArcs.forEach((arc, i) => {
      expect(arc.id).toBe(`middleArc${i}`)
      validateArcPath(arc.d, i)
    })

    textPaths.forEach((text, i) => {
      expect(text.href).toBe(`#middleArc${i}`)
      expect(text.text).toBe(`Gift ${i + 1}`)
      expect(text.dy).toMatch(/^-?40$/)
    })

    const svg = wrapper.find('svg')
    expect(svg.html()).toMatchSnapshot()
  })

  it('should have consistent arc path structure across different section counts', async () => {
    for (let count = 2; count <= 5; count++) {
      const data = createTestData(count)
      const wrapper = mount(FortuneWheel, {
        props: {
          data,
          modelValue: 1
        },
        attachTo: document.body
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 200))

      const hiddenArcs = getHiddenArcs(wrapper)

      hiddenArcs.forEach((arc, i) => {
        const d = arc.d || ''

        const arcRegex = /^M([^ ]+) ([^ ]+)A([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+) ([^ ]+)$/

        expect(d).toMatch(arcRegex)

        const match = arcRegex.exec(d)
        if (match) {
          for (let j = 1; j < match.length; j++) {
            expect(match[j]).toBeTruthy()
            expect(match[j]).not.toBe('NaN')
            expect(isNaN(Number(match[j]))).toBe(false)
          }
        }
      })
    }
  })
})
