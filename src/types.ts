// Type definitions for vue3-fortune-wheel 1.2.0
// Project: vue3-fortune-wheel
// Definitions by: Joffrey Berrier

export type Data = {
  id: number | { valueOf(): number }
  value: string
  bgColor: string
  color: string
}

export type ImgParams = {
  src: string
  width: number
  height: number
}
