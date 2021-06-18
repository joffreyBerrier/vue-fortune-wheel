<template>
  <div id="wheel" class="wheel" :style="wheelStyle" />
</template>

<script lang="ts">
  import * as d3 from 'd3'
  import { defineComponent, PropType } from 'vue'

  interface Data {
    value: string
    id: number
  }

  export default defineComponent({
    name: 'Wheel',
    props: {
      animDuration: {
        type: Number,
        default: 6000,
      },
      colors: {
        type: Array as string[],
        default: () => [],
      },
      data: {
        type: Object as PropType<Data>,
        default: () => ({}),
        validator: (data: Data): boolean => {
          return data.length <= 10
        },
      },
      modelValue: {
        type: Number,
        required: true,
      },
    },
    emits: ['done'],
    data() {
      return {
        arrow: null,
        clicked: false,
        container: null,
        pie: null,
        rotation: 0 as number,
        style: {
          width: 600,
          height: 600,
        },
        margin: 20,
        svg: null,
        vis: null,
      }
    },
    computed: {
      wheelStyle() {
        return {
          width: `${this.wheelSize.width}px`,
          height: `${this.wheelSize.height}px`,
        }
      },
      wheelSize() {
        const screenWidth = window.innerWidth
        const width = Math.min(screenWidth, this.style.width) - this.margin
        const height = Math.min(screenWidth, this.style.width) + 120

        return {
          width,
          height,
        }
      },
    },
    mounted() {
      this.rayon = Math.min(this.wheelSize.width, this.wheelSize.height) / 2

      this.createWheel()
    },
    methods: {
      createWheel() {
        // Create Svg
        this.createSvg()
        // Create shadow filter
        this.createDefs()
        // Create Group container
        this.createVis()
        // Declare an arc generator function
        this.createArc()
        // Add the text
        this.addText()
        // Make circle
        this.createMiddleCircle()
        this.createBorderCircle()
        // create arrow
        this.createArrow()
      },
      createSvg() {
        this.svg = d3
          .select('#wheel')
          .append('svg')
          .attr('font-size', '16px')
          .attr('height', '100%')
          .attr('width', '100%')
          .attr(
            'viewBox',
            `0 0 ${this.wheelSize.width + this.margin * 2} ${
              this.wheelSize.height
            }`
          )
          .data([this.data])
          .append('g')
          .attr('class', 'wrapper')
          .attr(
            'transform',
            `translate(${(this.wheelSize.width + this.margin * 2) / 2}, ${
              this.wheelSize.height / 2
            })`
          )
      },
      createDefs() {
        const defs = this.svg
          .append('defs')
          .append('filter')
          .attr('id', 'shadow')
          .attr('x', '-100%')
          .attr('y', '-100%')
          .attr('width', '550%')
          .attr('height', '550%')

        defs
          .append('feOffset')
          .attr('in', 'SourceAlpha')
          .attr('dx', 0)
          .attr('dy', 0)
          .attr('result', 'offsetOut')

        defs
          .append('feGaussianBlur')
          .attr('stdDeviation', '9')
          .attr('in', 'offsetOut')
          .attr('result', 'drop')

        defs
          .append('feColorMatrix')
          .attr('in', 'drop')
          .attr('result', 'color-out')
          .attr('type', 'matrix')
          .attr(
            'values',
            `0 0 0 0   0
          0 0 0 0   0
          0 0 0 0   0
          0 0 0 .3 0
        `
          )

        defs
          .append('feBlend')
          .attr('in', 'SourceGraphic')
          .attr('in2', 'color-out')
          .attr('mode', 'normal')
      },
      createVis() {
        this.container = this.svg.append('g').attr('class', 'wheelholder')

        // Create a G on container
        this.vis = this.container.append('g')

        this.pie = d3
          .pie()
          .value(() => {
            return 1
          })
          .padAngle(0.01)
          .sort(null)
      },
      createArc() {
        const arc = d3.arc().outerRadius(this.rayon).innerRadius(0)

        // Create the donut slices and also the invisible arcs for the text
        const that = this

        this.vis
          .selectAll('.middleArcText')
          .data(this.pie(this.data))
          .enter()
          .append('path')
          .attr('class', 'slice')
          .attr('d', arc)
          .attr('stroke', '#000000')
          .attr('stroke-width', '3')
          .attr('fill', (_, i) => {
            return this.colors[i % this.colors.length]
          })
          .each(function (d, i) {
            const firstArcSection = /(^.+?)L/

            let newArc = firstArcSection
              .exec(d3.select(this).attr('d'))[1]
              .replace(/,/g, ' ')

            if (d.endAngle > (90 * Math.PI) / 180) {
              const startLoc = /M(.*?)A/
              const middleLoc = /A(.*?)0 0 1/
              const endLoc = /0 0 1 (.*?)$/
              const newStart = endLoc.exec(newArc)[1]
              const newEnd = startLoc.exec(newArc)[1]
              const middleSec = middleLoc.exec(newArc)[1]

              newArc = `M${newStart}A${middleSec}0 0 0${newEnd}`
            }

            that.vis
              .append('path')
              .attr('class', 'hiddenarcs')
              .attr('id', 'middleArc' + i)
              .attr('d', newArc)
              .style('fill', 'none')
          })
      },
      addText() {
        this.vis
          .selectAll('.middleArcText')
          .data(this.pie(this.data))
          .enter()
          .append('text')
          .attr('class', 'middleArcText')
          .attr('dy', (d) => {
            return d.endAngle > (90 * Math.PI) / 180 ? -35 : 42
          })
          .append('textPath')
          .attr('startOffset', '50%')
          .attr('text-anchor', 'middle')
          .attr('xlink:href', (d, i) => {
            return '#middleArc' + i
          })
          .text((d) => {
            return d.data.value
          })
      },
      createMiddleCircle() {
        this.container
          .append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', this.rayon / 2.5)
          .attr('fill', '#ffffff')
          .attr('filter', 'url(#shadow)')
          .attr('stroke-width', 4)
          .attr('stroke', '#000000')
      },
      createBorderCircle() {
        this.container
          .append('g')
          .append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', (this.wheelSize.width - 4) / 2)
          .attr('fill', 'transparent')
          .attr('stroke-width', '8')
          .attr('filter', 'url(#shadow)')
          .attr('stroke', '#ffffff')
      },
      createArrow() {
        const pathArrow =
          'M95.3,9.8c-16.5,0-23.7,15.6-21.9,27c3.4,21.7,21.9,42.2,21.9,42.2s18.5-20.5,21.9-42.2 C118.9,25.4,111.8,9.8,95.3,9.8z'

        this.arrow = this.container
          .append('g')
          .append('path')
          .attr('d', pathArrow)
          .attr('transform', 'translate(-20, -300)')
          .attr('stroke', '#ffffff')
          .attr('fill', '#FFFFFF')
          .attr('filter', 'url(#shadow)')
          .attr(
            'transform',
            `matrix(1, 0, 0, 1, -95, -${
              this.wheelSize.height / 2 - this.margin
            })`
          )
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', '4')
      },
      findCurrentSlice(index) {
        return this.data.findIndex((x) => x.id === index) + 1
      },
      async spin(d) {
        if (!this.clicked) {
          this.clicked = true

          // Define current gain
          const slicedGift = this.findCurrentSlice(this.modelValue)
          const dataLength = this.data.length
          const sliceWidth = 360 / dataLength
          const currentAngle = 360 - sliceWidth * (slicedGift - 1)
          const numberOfRotation = 360 * 5
          const rotation = currentAngle + numberOfRotation

          this.rotation = Math.round(rotation / sliceWidth) * sliceWidth

          let picked = Math.round(
            dataLength - (this.rotation % 360) / sliceWidth
          )
          picked = picked >= dataLength ? picked % dataLength : picked

          // Center slice
          const sliceSize = sliceWidth + sliceWidth / 2
          this.rotation += sliceSize - Math.round(sliceWidth * 2)

          this.interpolate = d3.interpolate(0, this.rotation)

          const animateVis = () => {
            return this.vis
              .transition()
              .duration(this.animDuration)
              .ease(d3.easeBackOut.overshoot(0.3))
              .attrTween('transform', this.animRotation)
              .end()
          }

          await animateVis()

          this.$emit('done', this.data[picked])
        }
      },
      animRotation() {
        return (t) => {
          return `rotate(${this.interpolate(t)})`
        }
      },
    },
  })
</script>

<style scoped>
  .wheel {
    width: 100%;
    height: auto;
    margin: 0 auto;
  }
</style>
