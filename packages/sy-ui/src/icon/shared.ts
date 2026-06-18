import { icons } from 'lucide-react'
export const iconNames = Object.keys(icons)

export type IconName = (typeof iconNames)[number] | string
