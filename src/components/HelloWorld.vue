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
      data: [
        {
          label: "Dell LAPTOP",
          value: 1,
          question:
            "What CSS property is used for specifying the area between the content and its border?",
        },
        {
          label: "IMAC PRO",
          value: 2,
          question: "What CSS property is used for changing the font?",
        },
        {
          label: "SUZUKI",
          value: 3,
          question: "What CSS property is used for changing the color of text?",
        },
        {
          label: "HONDA",
          value: 4,
          question:
            "What CSS property is used for changing the boldness of text?",
        },
        {
          label: "FERRARI",
          value: 5,
          question: "What CSS property is used for changing the size of text?",
        },
        {
          label: "APARTMENT",
          value: 6,
          question:
            "What CSS property is used for changing the background color of a box?",
        },
      ],
      vis: null,
      width: 500 as number,
      height: 500 as number,
      padding: {
        top: 20,
        right: 40,
        bottom: 0,
        left: 0,
      },
      oldrotation: 0 as number,
      picked: 100000 as number,
      rotation: 0 as number,
    };
  },
  mounted() {
    const padding = { top: 20, right: 40, bottom: 0, left: 0 };
    const width = 500 - padding.left - padding.right;
    const height = 500 - padding.top - padding.bottom;
    const rayon = Math.min(width, height) / 2;
    const oldpick = [];
    const colors = ["#2196f3", "#ffc107"];

    // Create Svg
    const svgWidth = width + padding.left + padding.right;
    const svgHeight = height + padding.top + padding.bottom;
    const svg = d3
      .select("#chart")
      .append("svg")
      .data([this.data])
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Create Group container
    const createPathForGroupContainer = () => {
      const translate = width / 2 + padding.left;
      const h = height / 2 + padding.top;

      return `translate(${translate},${h})`;
    };
    const transformAttr = createPathForGroupContainer();
    const container = svg
      .append("g")
      .attr("class", "chartholder")
      .attr("transform", transformAttr);

    // Create a G on container
    this.vis = container.append("g");

    const pie = d3
      .pie()
      .sort(null)
      .value(() => {
        return 1;
      });

    // Declare an arc generator function
    const arc = d3.arc().outerRadius(rayon).innerRadius(0);

    // Select paths, use arc generator to draw
    const arcs = this.vis
      .selectAll("g.slice")
      .data(pie)
      .enter()
      .append("g")
      .attr("class", "slice");

    arcs
      .append("path")
      .attr("fill", (_, i) => {
        return colors[i % 2];
      })
      .attr("d", (d) => {
        console.log('iiiiii')
        return arc(d);
      });

    // Add the text
    const createPathForText = (d) => {
      const rotate = (d.angle * 180) / Math.PI - 90;
      const translate = d.outerRadius - 10;

      return `rotate(${rotate}) translate(${translate})`;
    };

    arcs
      .append("text")
      .attr("transform", (d) => {
        d.innerRadius = 0;
        d.outerRadius = rayon;
        d.angle = (d.startAngle + d.endAngle) / 2;

        return createPathForText(d);
      })
      .attr("text-anchor", "end")
      .text((d, i) => {
        return this.data[i].label;
      });

    // Make arrow
    const createPathArrowValue = () => {
      const translateX = width + padding.left + padding.right;
      const translateY = height / 2 + padding.top;

      return `translate(${translateX}, ${translateY})`;
    };

    const pathArrow = `M-${rayon * 0.15},0L0,${rayon * 0.05}L0,-${
      rayon * 0.05
    }Z`;

    svg
      .append("g")
      .attr("transform", createPathArrowValue())
      .append("path")
      .attr("d", pathArrow)
      .style({ fill: "black" });

    //draw spin circle
    container
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 100)
      .style({ fill: "white", cursor: "pointer" });
    //spin text
    container
      .append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("100% gagnant")
      .style({ "font-weight": "bold", "font-size": "20px" });
  },
  methods: {
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
      const one = this.oldRotation % 360 || 0
      const i = d3.interpolate(one, this.rotation);

      return (t) => {
        return `rotate(${i(t)})`;
      };
    },
  },
});
</script>

<style scoped>
text {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 11px;
  pointer-events: none;
}

#chart {
  position: absolute;
  width: 500px;
  height: 500px;
  top: 0;
  left: 0;
}

#question {
  position: absolute;
  width: 400px;
  height: 500px;
  top: 0;
  left: 520px;
}

#question h1 {
  font-size: 50px;
  font-weight: bold;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  position: absolute;
  padding: 0;
  margin: 0;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
</style>
