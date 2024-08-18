<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

import type { Arc, Pie } from 'd3'
import type { Data, ImgParams } from '../types'

const FULL_CIRCLE = 360
const ROTATIONS = 5
const MAX_FONT_SIZE = 16
const MARGIN = 20

const props = withDefaults(
  defineProps<{
    data: Data[]
    animDuration?: number
    modelValue?: number
    imgParams?: ImgParams
    middleCircle?: boolean
  }>(),
  {
    animDuration: 6000,
    modelValue: 0,
    middleCircle: true,
    imgParams: () => ({
      src: '',
      width: 0,
      height: 0
    })
  }
)

const emit = defineEmits<{
  (e: 'done', value: Data): void
}>()

const pieGenerator = ref<Pie<any, Data> | null>(null)
const arcGenerator = ref<Arc<any, d3.PieArcDatum<Data>> | null>(null)

const arrow = ref<SVGElement | null>(null)
const container = ref<SVGGElement | null>(null)
const rayon = ref<number>(0)
const rotation = ref<number>(0)
const isSpinning = ref<boolean>(false)
const style = ref<{ width: number }>({
  width: 600
})

const svg = ref<SVGGElement | null>(null)
const vis = ref<SVGGElement | null>(null)

const wheelSize = computed(() => {
  if (typeof window !== 'undefined') {
    const screenWidth = window.innerWidth
    const width = Math.min(screenWidth, style.value.width) - MARGIN
    const height = Math.min(screenWidth, style.value.width) + 120

    return { width, height }
  }

  return { width: 600, height: 600 }
})

const fontSize = computed(() => {
  if (props.data.length <= 4) return MAX_FONT_SIZE
  if (props.data.length <= 6) return 12

  return 10
})
const wheelStyle = computed(() => ({
  width: `${wheelSize.value.width}px`,
  height: `${wheelSize.value.height}px`,
  fontSize: `${fontSize.value}px`,
  margin: '0 auto'
}))

const createMiddleCircle = () => {
  if (!container.value) return

  d3.select(container.value)
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', rayon.value / 2.5)
    .attr('fill', '#ffffff')
    .attr('filter', 'url(#shadow)')
    .attr('stroke-width', 4)
    .attr('stroke', '#000000')
}

const createBorderCircle = () => {
  if (!container.value) return

  d3.select(container.value)
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
  if (!container.value || !props.imgParams) return

  const { width, height, src } = props.imgParams

  d3.select(container.value)
    .append('image')
    .attr('x', -width / 2)
    .attr('y', -height / 2)
    .attr('width', width)
    .attr('height', height)
    .attr('href', src)
    .attr('preserveAspectRatio', 'xMidYMid meet')
}

const createArrow = () => {
  if (!container.value) return

  const pathArrow =
    'M95.3,9.8c-16.5,0-23.7,15.6-21.9,27c3.4,21.7,21.9,42.2,21.9,42.2s18.5-20.5,21.9-42.2 C118.9,25.4,111.8,9.8,95.3,9.8z'

  arrow.value = d3
    .select(container.value)
    .append('path')
    .attr('d', pathArrow)
    .attr('stroke', '#ffffff')
    .attr('fill', '#FFFFFF')
    .attr('filter', 'url(#shadow)')
    .attr('transform', `matrix(1, 0, 0, 1, -95, -${wheelSize.value.height / 2 - MARGIN})`)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', '4')
    .node()
}

const findCurrentSlice = (index: number): number => {
  if (props.data.length === 0) return 0
  return props.data.findIndex((x) => x.id === index) + 1
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
    .attr('font-size', `${MAX_FONT_SIZE}px`)
    .attr('height', '100%')
    .attr('width', '100%')
    .attr('viewBox', `0 0 ${wheelSize.value.width + MARGIN * 2} ${wheelSize.value.height}`)
    .attr('aria-label', 'Fortune Wheel')

  svg.value = svgElement
    .append('g')
    .attr('class', 'wrapper')
    .attr(
      'transform',
      `translate(${(wheelSize.value.width + MARGIN * 2) / 2}, ${wheelSize.value.height / 2})`
    )
    .node()
}

const createDefs = () => {
  if (!svg.value) return

  const defs = d3.select(svg.value).append('defs')

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
  if (!svg.value) return

  container.value = d3.select(svg.value).append('g').attr('class', 'wheelholder').node()

  vis.value = d3.select(container.value).append('g').node()

  pieGenerator.value = d3
    .pie<Data>()
    .value(() => 1)
    .padAngle(0.01)
    .sort(null)

  arcGenerator.value = d3.arc<d3.PieArcDatum<Data>>().outerRadius(rayon.value).innerRadius(0)
}

const createArc = () => {
  if (!pieGenerator.value || !arcGenerator.value || !vis.value) return

  const arcs = pieGenerator.value(props.data)

  const slices = d3
    .select(vis.value)
    .selectAll<SVGPathElement, d3.PieArcDatum<Data>>('.slice')
    .data(arcs)
    .join('path')
    .attr('class', 'slice')
    .attr('d', arcGenerator.value)
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

    d3.select(vis.value)
      .append('path')
      .attr('class', 'hiddenarcs')
      .attr('id', `middleArc${i}`)
      .attr('d', newArc)
      .style('fill', 'none')
  })
}

const addText = () => {
  if (!pieGenerator.value || !vis.value) return

  const arcs = pieGenerator.value(props.data)

  d3.select(vis.value)
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

    rotation.value = Math.round(r / sliceWidth) * sliceWidth

    let picked = Math.round(dataLength - (rotation.value % FULL_CIRCLE) / sliceWidth)
    picked = picked >= dataLength ? picked % dataLength : picked

    // Center slice
    const sliceSize = sliceWidth + sliceWidth / 2
    rotation.value += sliceSize - Math.round(sliceWidth * 2)

    const interpolate = d3.interpolate(0, rotation.value)

    if (vis.value) {
      await d3
        .select(vis.value)
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

const redrawWheel = () => {
  d3.select('#wheel').selectAll('*').remove()
  createWheel()
}

watch(() => props.data, redrawWheel, { deep: true })

defineExpose({
  spin
})

onMounted(() => {
  rayon.value = Math.min(wheelSize.value.width, wheelSize.value.height) / 2

  createWheel()
})
</script>

<template>
  <div id="wheel" class="wheel" :style="wheelStyle" />
</template>
