import { Dict } from '@syvobase/utils'
import { CSSProperties } from 'react'

export const tagStyleMap: Dict<CSSProperties> = {
  blue: {
    color: 'rgb(30, 64, 175)', // blue-700
    backgroundColor: 'rgb(219, 234, 254)', // blue-100
    borderColor: 'rgb(147, 197, 253)', // blue-200
  },
  green: {
    color: 'rgb(21, 128, 61)', // green-700
    backgroundColor: 'rgb(220, 252, 231)', // green-100
    borderColor: 'rgb(167, 243, 208)', // green-200
  },
  red: {
    color: 'rgb(185, 28, 28)', // red-700
    backgroundColor: 'rgb(254, 226, 226)', // red-100
    borderColor: 'rgb(254, 202, 202)', // red-200
  },
  orange: {
    color: 'rgb(194, 65, 12)', // orange-700
    backgroundColor: 'rgb(255, 237, 213)', // orange-100
    borderColor: 'rgb(254, 215, 170)', // orange-200
  },
  magenta: {
    color: 'rgb(157, 23, 77)', // pink-700
    backgroundColor: 'rgb(252, 231, 243)', // pink-100
    borderColor: 'rgb(251, 207, 232)', // pink-200
  },
  cyan: {
    color: 'rgb(14, 116, 144)', // cyan-700
    backgroundColor: 'rgb(207, 250, 254)', // cyan-100
    borderColor: 'rgb(165, 243, 252)', // cyan-200
  },
  purple: {
    color: 'rgb(126, 34, 206)', // purple-700
    backgroundColor: 'rgb(243, 232, 255)', // purple-100
    borderColor: 'rgb(233, 213, 255)', // purple-200
  },
  volcano: {
    color: 'rgb(180, 83, 9)', // amber-700 / volcanic风
    backgroundColor: 'rgb(254, 243, 199)', // amber-100
    borderColor: 'rgb(253, 230, 138)', // amber-200
  },
  gold: {
    color: 'rgb(161, 98, 7)', // yellow-700
    backgroundColor: 'rgb(254, 249, 195)', // yellow-100
    borderColor: 'rgb(254, 240, 138)', // yellow-200
  },
  lime: {
    color: 'rgb(101, 163, 13)', // lime-700
    backgroundColor: 'rgb(236, 252, 203)', // lime-100
    borderColor: 'rgb(217, 249, 157)', // lime-200
  },
  geekblue: {
    color: 'rgb(55, 48, 163)', // indigo-700
    backgroundColor: 'rgb(224, 231, 255)', // indigo-100
    borderColor: 'rgb(199, 210, 254)', // indigo-200
  },
  gray: {
    color: 'rgb(55, 65, 81)', // gray-700
    backgroundColor: 'rgb(243, 244, 246)', // gray-100
    borderColor: 'rgb(229, 231, 235)', // gray-200
  },
}
