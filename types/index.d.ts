// Type definitions for vue3-fortune-wheel 0.0.5
// Project: vue3-fortune-wheel
// Definitions by: Joffrey Berrier
import type { Ref } from "vue";

export type Data = {
  id: number;
  value: string;
  bgColor: string;
  color: string;
};

export type Datas = Data[];

export type imgParams = {
  src: string;
  width: number;
  height: number;
};

export type d3Data = {
  data: Ref<Data>;
  endAngle: number;
  index: number;
  padAngle: number;
  startAngle: number;
  value: number;
};
