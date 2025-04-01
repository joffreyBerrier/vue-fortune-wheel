import * as d3 from 'd3'
import type { ComputedRef } from 'vue'
import type { Data } from '@/types'
import { reactive, watch } from 'vue'
import type { WheelProps } from '@/FortuneWheel.vue'

interface WheelState {
  pieGenerator: d3.Pie<any, Data> | null
  arcGenerator: d3.Arc<any, d3.PieArcDatum<Data>> | null
  arrow: SVGElement | null
  container: SVGGElement | null
  rayon: number
  rotation: number
  isSpinning: boolean
  svg: SVGGElement | null
  vis: SVGGElement | null
  error: string | null
  isRendering: boolean
  renderAttempts: number
}

const STROKE_WIDTH = 8

export function useWheelCreation(
  props: WheelProps,
  wheelSize: ComputedRef<{ width: number; height: number }>,
  isMobile: ComputedRef<boolean>
) {
  if (!props.data || props.data.length === 0) {
    throw new Error('Wheel data cannot be empty')
  }

  const calculateRadius = () => {
    const minDimension = Math.min(wheelSize.value.width, wheelSize.value.height)

    return (minDimension - 8) / 2
  }

  const state = reactive<WheelState>({
    pieGenerator: null,
    arcGenerator: null,
    arrow: null,
    container: null,
    rayon: calculateRadius(),
    rotation: 0,
    isSpinning: false,
    svg: null,
    vis: null,
    error: null,
    isRendering: false,
    renderAttempts: 0
  })

  watch(() => wheelSize.value, () => {
    state.rayon = calculateRadius()

    if (!state.isRendering) {
      redrawWheel()
    }
  })

  const MAX_RENDER_ATTEMPTS = 3

  const getFontSize = (sectionsCount: number): number => {
    if (isMobile) {
      if (sectionsCount <= 3) return 16
      if (sectionsCount <= 5) return 12
      if (sectionsCount <= 9) return 10
      return 8
    } else {
      if (sectionsCount <= 3) return 18
      if (sectionsCount <= 7) return 13
      return 11
    }
  }

  const createMiddleCircle = () => {
    if (!state.container) return

    d3.select(state.container)
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', state.rayon / 2.5)
      .attr('fill', '#ffffff')
      .attr('stroke-width', STROKE_WIDTH / 2)
      .attr('stroke', '#000000')
      .attr('filter', 'url(#arrowShadow)')
  }

  const createBorderCircle = () => {
    if (!state.container) return

    d3.select(state.container)
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', (wheelSize.value.width - 4) / 2)
      .attr('fill', 'transparent')
      .attr('stroke-width', 10)
      .attr('stroke', '#ffffff')
      .attr('filter', 'url(#arrowShadow)')
  }

  const addImgOnCenter = () => {
    if (!state.container || !props.imgParams) return

    const { width, height, src } = props.imgParams

    const img = new Image()
    img.onerror = () => {
      state.error = 'Failed to load center image'
      console.error('Failed to load image:', src)
    }

    img.onload = () => {
      d3.select(state.container)
        .append('image')
        .attr('x', -width / 2)
        .attr('y', -height / 2)
        .attr('width', width)
        .attr('height', height)
        .attr('href', src)
        .attr('preserveAspectRatio', 'xMidYMid meet')
    }

    img.src = src
  }

  const createArrow = () => {
    if (!state.container) return

    const pathArrow = 'M 95.3 9.8 C 78.8 9.8 71.6 25.4 73.4 36.8 C 76.8 58.5 95.3 79 95.3 79 S 113.8 58.5 117.2 36.8 C 119 25.4 111.8 9.8 95.3 9.8 Z'

    state.arrow = d3
      .select(state.container)
      .append('path')
      .attr('d', pathArrow)
      .attr('stroke', '#ffffff')
      .attr('fill', '#FFFFFF')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', STROKE_WIDTH / 2)
      .attr('filter', 'url(#arrowShadow)')
      .attr('transform', `translate(-95, ${-wheelSize.value.height / 2 + 20})`)
      .node()
  }

  const createSvg = () => {
    try {
      const fontSize = getFontSize(props.data.length)
      const svgElement = d3
        .select('#wheel')
        .append('svg')
        .attr('font-size', `${fontSize}px`)
        .attr('font-family', props.fontFamily || 'Arial, sans-serif')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('viewBox', `0 0 ${wheelSize.value.width + 40} ${wheelSize.value.height}`)
        .attr('shape-rendering', 'optimizeSpeed')
        .attr('aria-label', 'Fortune Wheel')

      if (!svgElement.node()) {
        throw new Error('Failed to create SVG element')
      }

      const defs = svgElement.append('defs')
      const filter = defs
        .append('filter')
        .attr('id', 'arrowShadow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%')

      filter
        .append('feOffset')
        .attr('in', 'SourceAlpha')
        .attr('dx', 0)
        .attr('dy', 0)
        .attr('result', 'offsetOut')

      filter
        .append('feGaussianBlur')
        .attr('stdDeviation', 6)
        .attr('in', 'offsetOut')
        .attr('result', 'blurOut')

      filter
        .append('feColorMatrix')
        .attr('in', 'blurOut')
        .attr('type', 'matrix')
        .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.20 0')
        .attr('result', 'shadowOut')

      filter
        .append('feBlend')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'shadowOut')
        .attr('mode', 'normal')

      state.svg = svgElement
        .append('g')
        .attr('class', 'wrapper')
        .attr(
          'transform',
          `translate(${(wheelSize.value.width + 40) / 2}, ${wheelSize.value.height / 2})`
        )
        .node()

      if (!state.svg) {
        throw new Error('Failed to create SVG wrapper')
      }
    } catch (error) {
      state.error = `Error creating SVG: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  const createVis = () => {
    if (!state.svg) return

    state.container = d3.select(state.svg).append('g').attr('class', 'wheelholder').node()
    state.vis = d3.select(state.container).append('g').node()

    state.pieGenerator = d3
      .pie<Data>()
      .value(() => 1)
      .sort(null)

    state.arcGenerator = d3
      .arc<d3.PieArcDatum<Data>>()
      .outerRadius(state.rayon)
      .innerRadius(0)
  }

  const createArc = () => {
    try {
      if (!state.pieGenerator || !state.arcGenerator || !state.vis) {
        throw new Error('Required generators or visual elements not initialized')
      }

      if (!props.data.every((item: Data, index: number) => {
        if (!item.value) {
          throw new Error(`Invalid data format at index ${index}: missing 'value' property`)
        }
        if (!item.bgColor) {
          throw new Error(`Invalid data format at index ${index}: missing 'bgColor' property`)
        }
        if (!item.color) {
          throw new Error(`Invalid data format at index ${index}: missing 'color' property`)
        }
        return true
      })) {
        throw new Error('Invalid data format: validation failed')
      }

      const arcs = state.pieGenerator(props.data)

      const slices = d3.select(state.vis)
        .selectAll<SVGPathElement, d3.PieArcDatum<Data>>('.slice')
        .data(arcs)
        .join('path')
        .attr('class', 'slice')
        .attr('d', state.arcGenerator)
        .attr('stroke', '#000000')
        .attr('stroke-width', STROKE_WIDTH / 2)
        .attr('fill', (d) => d.data.bgColor)
        .attr('shape-rendering', 'auto')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')

      slices.each(function (d, i) {
        try {
          const firstArcSection = /(^.+?)L/
          let newArc = firstArcSection.exec(d3.select(this).attr('d') || '')?.[1]?.replace(/,/g, ' ') || ''

          if (d.endAngle > Math.PI / 2) {
            const startLoc = /M(.*?)A/
            const middleLoc = /A(.*?)0 0 1/
            const endLoc = /0 0 1 (.*?)$/
            const newStart = endLoc.exec(newArc)?.[1] || ''
            const newEnd = startLoc.exec(newArc)?.[1] || ''
            const middleSec = middleLoc.exec(newArc)?.[1] || ''

            newArc = `M${newStart}A${middleSec}0 0 0${newEnd}`
          }

          d3.select(state.vis)
            .append('path')
            .attr('class', 'hiddenarcs')
            .attr('id', `middleArc${i}`)
            .attr('d', newArc)
            .style('fill', 'none')
        } catch (error) {
          state.error = `Error creating arc ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      })
    } catch (error) {
      state.error = `Error creating arcs: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  const addText = () => {
    try {
      if (!state.pieGenerator || !state.vis) {
        throw new Error('Required generators or visual elements not initialized')
      }

      const arcs = state.pieGenerator(props.data)
      const fontSize = getFontSize(props.data.length)

      d3.select(state.vis)
        .selectAll<SVGTextElement, d3.PieArcDatum<Data>>('.middleArcText')
        .data(arcs)
        .join('text')
        .attr('class', 'middleArcText')
        .attr('dy', (d) => (d.endAngle > Math.PI / 2 ? -40 : 40))
        .append('textPath')
        .attr('startOffset', '50%')
        .attr('text-anchor', 'middle')
        .attr('stroke', '#0000001a')
        .attr('fill', (d) => d.data.color)
        .attr('font-family', props.fontFamily || 'Arial, sans-serif')
        .attr('font-size', `${fontSize}px`)
        .attr('letter-spacing', '1px')
        .attr('xlink:href', (_, i) => `#middleArc${i}`)
        .text((d) => d.data.value)
    } catch (error) {
      state.error = `Error adding text: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  const createWheel = () => {
    try {
      if (state.isRendering) {
        console.warn('Wheel is already rendering, skipping...')
        return
      }

      if (state.renderAttempts >= MAX_RENDER_ATTEMPTS) {
        state.error = 'Maximum render attempts reached. Please refresh the page.'
        return
      }

      if (wheelSize.value.width <= 0 || wheelSize.value.height <= 0) {
        throw new Error('Invalid wheel size: width and height must be positive')
      }

      state.isRendering = true
      state.renderAttempts++
      state.error = null

      const render = () => {
        try {
          cleanup()
          
          createSvg()
          createVis()
          createArc()
          addText()
          if (props.middleCircle) createMiddleCircle()
          createBorderCircle()
          if (props.imgParams?.src) addImgOnCenter()
          createArrow()
        } catch (error) {
          state.error = `Error during render: ${error instanceof Error ? error.message : 'Unknown error'}`
          console.error('Error during render:', error)
        } finally {
          state.isRendering = false
        }
      }

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(render)
      } else {
        render()
      }
    } catch (error) {
      state.error = `Error creating wheel: ${error instanceof Error ? error.message : 'Unknown error'}`
      state.isRendering = false
      console.error('Error in createWheel:', error)
    }
  }

  const redrawWheel = () => {
    try {
      if (state.isRendering) {
        console.warn('Wheel is already rendering, skipping redraw...')
        return
      }

      if (!state.vis || !state.container) {
        throw new Error('Required visual elements not initialized')
      }

      state.isRendering = true
      state.error = null

      d3.select('#wheel').selectAll('.slice, .middleArcText, .hiddenarcs, .middleCircle, .borderCircle, .centerImage').remove()
      
      createArc()
      addText()
      if (props.middleCircle) createMiddleCircle()
      createBorderCircle()
      if (props.imgParams?.src) addImgOnCenter()
    } catch (error) {
      state.error = `Error redrawing wheel: ${error instanceof Error ? error.message : 'Unknown error'}`
    } finally {
      state.isRendering = false
    }
  }

  const cleanup = () => {
    try {
      if (state.svg) {
        d3.select(state.svg).remove()
        state.svg = null
        state.vis = null
        state.container = null
        state.arrow = null
        state.pieGenerator = null
        state.arcGenerator = null
      }
    } catch (error) {
      state.error = `Error during cleanup: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  return { 
    state,
    createWheel, 
    redrawWheel,
    cleanup
  }
}
