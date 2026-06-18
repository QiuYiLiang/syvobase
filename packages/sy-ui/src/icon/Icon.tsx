import { ComponentProps, CSSProperties, FC, useContext } from 'react'
import { icons, LucideProps } from 'lucide-react'
import { cn } from '@/utils'
import { SyvobaseUiContext } from '@/syvobaseUI'
import { mergeTag } from '@/utils/tag'
import { IconName } from './shared'

interface LucideIconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
}

const LucideIcon = ({ name, ...props }: LucideIconProps) => {
  const LucideIcon = icons[name]
  if (!LucideIcon) {
    return null
  }

  return <LucideIcon {...props} size={'1em'} />
}

export interface IconProps {
  name: IconName
  className?: string
  color?: CSSProperties['color']
  style?: CSSProperties
  size?: CSSProperties['fontSize']
}

export type SvgComponent = FC<ComponentProps<'svg'> & { title?: string }>

const CustomeIconComponents: Record<string, SvgComponent> = {}

const svgModules = import.meta.glob('./svgs/*.svg', {
  eager: true,
  query: '?react',
})
for (const key in svgModules) {
  const svgName = `icon-${key.replace('./svgs/', '').replace('.svg', '')}`
  CustomeIconComponents[svgName] = (
    svgModules[key] as {
      default: SvgComponent
    }
  ).default
}

export const Icon = (props: IconProps) => {
  const { name, className, color, size, style = {} } = props
  const icons = useContext(SyvobaseUiContext)
  if (!name) {
    return null
  }
  const isCustome = name.startsWith('icon-')
  if (color) {
    style.color = color
  }
  if (size) {
    style.fontSize = size
  }
  if (isCustome) {
    const Component = { ...icons, ...CustomeIconComponents }[
      name
    ] as SvgComponent
    if (!Component) {
      return null
    }
    return (
      <Component
        {...mergeTag('icon', props)}
        className={className}
        style={style}
      />
    )
  }
  return (
    <LucideIcon
      {...mergeTag('icon', props)}
      className={cn(
        ['Loader', 'LoaderCircle'].includes(name) && 'animate-spin',
        className
      )}
      name={name}
      style={{
        ...(name === 'Loader'
          ? {
              transitionDuration: '3000ms',
            }
          : {}),
        ...style,
      }}
    />
  )
}
