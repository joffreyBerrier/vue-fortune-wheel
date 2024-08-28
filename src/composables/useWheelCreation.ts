import * as d3 from 'd3'
import type { ComputedRef } from 'vue'
import type { Data, ImgParams } from '@/types'

interface Props {
  data: Data[]
  middleCircle?: boolean
  imgParams?: ImgParams
}

interface State {
  pieGenerator: d3.Pie<any, Data> | null
  arcGenerator: d3.Arc<any, d3.PieArcDatum<Data>> | null
  arrow: SVGElement | null
  container: SVGGElement | null
  rayon: number
  svg: SVGGElement | null
  vis: SVGGElement | null
}

export function useWheelCreation(
  state: State,
  props: Props,
  wheelSize: ComputedRef<{ width: number; height: number }>
) {
  const createMiddleCircle = () => {
    if (!state.container) return

    d3.select(state.container)
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', state.rayon / 2.5)
      .attr('fill', '#ffffff')
      .attr('filter', 'url(#shadow)')
      .attr('stroke-width', 4)
      .attr('stroke', '#000000')
  }

  const createBorderCircle = () => {
    if (!state.container) return

    d3.select(state.container)
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', (wheelSize.value.width - 4) / 2)
      .attr('fill', 'transparent')
      .attr('stroke-width', '8')
      .attr('filter', 'url(#shadow)')
      .attr('stroke', '#ffffff')
  }

  const addImgOnCenter = () => {
    if (!state.container || !props.imgParams) return

    const { width, height, src } = props.imgParams

    d3.select(state.container)
      .append('image')
      .attr('x', -width / 2)
      .attr('y', -height / 2)
      .attr('width', width)
      .attr('height', height)
      .attr('href', src)
      .attr('preserveAspectRatio', 'xMidYMid meet')
  }

  const createArrow = () => {
    if (!state.container) return

    const pathArrow =
      'M95.3,9.8c-16.5,0-23.7,15.6-21.9,27c3.4,21.7,21.9,42.2,21.9,42.2s18.5-20.5,21.9-42.2 C118.9,25.4,111.8,9.8,95.3,9.8z'

    state.arrow = d3
      .select(state.container)
      .append('path')
      .attr('d', pathArrow)
      .attr('stroke', '#ffffff')
      .attr('fill', '#FFFFFF')
      .attr('filter', 'url(#shadow)')
      .attr('transform', `matrix(1, 0, 0, 1, -95, -${wheelSize.value.height / 2 - 20})`)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', '4')
      .node()
  }

  const createWheel = () => {
    createSvg()
    createDefs()
    createVis()
    createArc()
    addText()
    if (props.middleCircle) createMiddleCircle()
    createBorderCircle()
    if (props.imgParams?.src) addImgOnCenter()
    createArrow()
  }

  const createSvg = () => {
    const svgElement = d3
      .select('#wheel')
      .append('svg')
      .attr('font-size', `16px`)
      .attr('height', '100%')
      .attr('width', '100%')
      .attr('viewBox', `0 0 ${wheelSize.value.width + 40} ${wheelSize.value.height}`)
      .attr('aria-label', 'Fortune Wheel')

    state.svg = svgElement
      .append('g')
      .attr('class', 'wrapper')
      .attr(
        'transform',
        `translate(${(wheelSize.value.width + 40) / 2}, ${wheelSize.value.height / 2})`
      )
      .node()
  }

  const createDefs = () => {
    if (!state.svg) return

    const defs = d3.select(state.svg).append('defs')

    const filter = defs
      .append('filter')
      .attr('id', 'shadow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '550%')
      .attr('height', '550%')

    filter
      .append('feOffset')
      .attr('in', 'SourceAlpha')
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('result', 'offsetOut')

    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '9')
      .attr('in', 'offsetOut')
      .attr('result', 'drop')

    filter
      .append('feColorMatrix')
      .attr('in', 'drop')
      .attr('result', 'color-out')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0')

    filter
      .append('feBlend')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'color-out')
      .attr('mode', 'normal')
  }

  const createVis = () => {
    if (!state.svg) return

    state.container = d3.select(state.svg).append('g').attr('class', 'wheelholder').node()

    state.vis = d3.select(state.container).append('g').node()

    state.pieGenerator = d3
      .pie<Data>()
      .value(() => 1)
      .padAngle(0.01)
      .sort(null)

    state.arcGenerator = d3.arc<d3.PieArcDatum<Data>>().outerRadius(state.rayon).innerRadius(0)
  }

  const createArc = () => {
    if (!state.pieGenerator || !state.arcGenerator || !state.vis) return

    const arcs = state.pieGenerator(props.data)

    const slices = d3
      .select(state.vis)
      .selectAll<SVGPathElement, d3.PieArcDatum<Data>>('.slice')
      .data(arcs)
      .join('path')
      .attr('class', 'slice')
      .attr('d', state.arcGenerator)
      .attr('stroke', '#000000')
      .attr('stroke-width', '3')
      .attr('fill', (d) => d.data.bgColor)

    slices.each(function (d, i) {
      const firstArcSection = /(^.+?)L/
      let newArc =
        firstArcSection.exec(d3.select(this).attr('d') || '')?.[1]?.replace(/,/g, ' ') || ''

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
    })
  }

  const addText = () => {
    if (!state.pieGenerator || !state.vis) return

    const arcs = state.pieGenerator(props.data)

    d3.select(state.vis)
      .selectAll<SVGTextElement, d3.PieArcDatum<Data>>('.middleArcText')
      .data(arcs)
      .join('text')
      .attr('class', 'middleArcText')
      .attr('dy', (d) => (d.endAngle > Math.PI / 2 ? -35 : 42))
      .append('textPath')
      .attr('startOffset', '50%')
      .attr('letter-spacing', '1px')
      .attr('text-anchor', 'middle')
      .attr('stroke', 'rgb(0 0 0 / 10%)')
      .attr('fill', (d) => d.data.color)
      .attr('xlink:href', (_, i) => `#middleArc${i}`)
      .text((d) => d.data.value)
  }

  const redrawWheel = () => {
    d3.select('#wheel').selectAll('*').remove()
    createWheel()
  }

  return { createWheel, redrawWheel }
}
