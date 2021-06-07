<template>
  <div @click="spin" id="chart"></div>
</template>

<script lang="ts">
import * as d3 from "d3";
import { ref, defineComponent } from "vue";
export default defineComponent({
  name: "Wheel",
  setup: () => {
    const count = ref(0);
    const useScriptSetup = ref(false);
    const useTsPlugin = ref(false);
    return { count, useScriptSetup, useTsPlugin };
  },
  data() {
    return {
      arcs: null,
      container: null,
      colors: ["#eb9b51", "#028b8c"] as string[],
      data: [
        {
          label: "Fish and Chips",
          value: 1,
          question:
            "What CSS property is used for specifying the area between the content and its border?",
        },
        {
          label: "M in Black Burger",
          value: 2,
          question: "What CSS property is used for changing the font?",
        },
        {
          label: "Pack de 3 bières",
          value: 3,
          question: "What CSS property is used for changing the color of text?",
        },
        {
          label: "Fish Balls x6",
          value: 4,
          question:
            "What CSS property is used for changing the boldness of text?",
        },
        {
          label: "Jus de fruits",
          value: 5,
          question: "What CSS property is used for changing the size of text?",
        },
        {
          label: "Dessert maison",
          value: 6,
          question:
            "What CSS property is used for changing the background color of a box?",
        },
      ],
      color: {
        bgCircle: "#ffffff",
        borderCircle: "#000000",
        arrowBg: "#eb9b51",
        strokeSlice: "#000000",
        text: "#ffffff",
      },
      pie: null,
      vis: null,
      width: 600 as number,
      height: 600 as number,
      padding: {
        top: 20,
        right: 40,
        bottom: 0,
        left: 0,
      },
      svg: null,
      oldrotation: 0 as number,
      picked: 100000 as number,
      rotation: 0 as number,
    };
  },
  mounted() {
    this.width = this.width - this.padding.left - this.padding.right;
    this.height = this.width;
    this.rayon = Math.min(this.width, this.height - 10) / 2;

    // Create Svg
    this.createSvg();

    // Create Group container
    this.createVis();

    // Declare an arc generator function
    this.createArc();

    // Add the text
    this.addText();

    // Make arrow
    this.createArrow();

    // Make circle
    this.createCircle();
  },
  methods: {
    createSvg() {
      const svgWidth = this.width + this.padding.left + this.padding.right;
      const svgHeight = svgWidth;
      this.svg = d3
        .select("#chart")
        .append("svg")
        .data([this.data])
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    },
    createVis() {
      const createPathForGroupContainer = () => {
        const translate = this.width / 2 + this.padding.left;
        const h = this.height / 2 + this.padding.top;

        return `translate(${translate},${h})`;
      };

      const transformAttr = createPathForGroupContainer();

      this.container = this.svg
        .append("g")
        .attr("class", "chartholder")
        .attr("transform", transformAttr);

      // Create a G on container
      this.vis = this.container.append("g");

      this.pie = d3
        .pie()
        .sort(null)
        .value(() => {
          return 1;
        });
    },
    createArc() {
      const arc = d3.arc().outerRadius(this.rayon).innerRadius(0);

      // Select paths and use arc generator to draw slice
      this.arcs = this.vis
        .selectAll("g.slice")
        .data(this.pie)
        .enter()
        .append("g")
        .attr("class", "slice");

      this.arcs
        .append("path")
        .attr("fill", (_, i) => {
          return this.colors[i % 2];
        })
        .attr("stroke", (_, i) => {
          return this.color.strokeSlice;
        })
        .attr("stroke-width", (_, i) => {
          return "3";
        })
        .attr("d", (d) => {
          return arc(d);
        });
    },
    addText() {
      const createPathForText = (d) => {
        const rotate = (d.angle * 180) / Math.PI - 90;
        const translate = d.outerRadius - 10;

        return `rotate(${rotate}) translate(${translate})`;
      };

      this.arcs
        .append("text")
        .attr("transform", (d) => {
          d.outerRadius = this.rayon;
          d.angle = (d.startAngle + d.endAngle) / 2;

          return createPathForText(d);
        })
        .attr("text-anchor", "end")
        .attr("fill", this.color.text)
        .text((d, i) => {
          return this.data[i].label;
        });
    },
    createArrow() {
      const createPathArrowValue = () => {
        const translateX = this.width + this.padding.left + this.padding.right;
        const translateY = this.height / 2 + this.padding.top;

        return `translate(${translateX}, ${translateY})`;
      };

      const pathArrow = `M-${this.rayon * 0.15},0L0,${this.rayon * 0.05}L0,-${
        this.rayon * 0.05
      }Z`;

      this.svg
        .append("g")
        .attr("transform", createPathArrowValue())
        .append("path")
        .attr("d", pathArrow)
        .attr("fill", (_, i) => {
          return this.color.arrowBg;
        });
    },
    createCircle() {
      this.container
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", this.width / 4)
        .attr("fill", (_, i) => {
          return this.color.bgCircle;
        })
        .attr("stroke", (_, i) => {
          return this.color.borderCircle;
        })
        .attr("stroke-width", (_, i) => {
          return "8px";
        });
    },
    async spin(d) {
      const dataLength = this.data.length;
      const ps = 360 / dataLength;
      const rng = Math.floor(Math.random() * 1440 + 360);

      this.rotation = Math.round(rng / ps) * ps;

      this.picked = Math.round(dataLength - (this.rotation % 360) / ps);
      this.picked =
        this.picked >= dataLength ? this.picked % dataLength : this.picked;
      this.rotation += 90 - Math.round(ps / 2);

      await this.vis
        .transition()
        .duration(1000)
        .ease(d3.easeBounce)
        .attrTween("transform", this.rotTween)
        .end();

      d3.select(".slice:nth-child(" + (this.picked + 1) + ") path").attr(
        "fill",
        "#e0e0e0"
      );
      console.log("DONE :", this.data[this.picked].value);
    },
    rotTween(to) {
      const one = this.oldRotation % 360 || 0;
      const i = d3.interpolate(one, this.rotation);

      return (t) => {
        return `rotate(${i(t)})`;
      };
    },
  },
});
</script>

<style>
text {
  color: white;
}
circle {
  filter: drop-shadow(0px 8px 24px rgba(149, 157, 165, 0.2));
}
</style>
