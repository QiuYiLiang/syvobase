import { cn, useControllable } from '@/utils'
import { AutoLayoutProps, calculationLayout, DEFAULT_XSTEP } from './shared'
import { mergeTag } from '@/utils/tag'

export const AutoLayoutMobile = (props: AutoLayoutProps) => {
  const { className, xStep = DEFAULT_XSTEP, style, onItemRender } = props
  const [value] = useControllable<AutoLayoutProps, 'value'>({
    props,
    value: [],
  })
  return (
    <div
      {...mergeTag('auto-layout-mobile', props)}
      className={cn('w-full', className)}
      style={style}
    >
      {calculationLayout({
        layout: value,
        xStep,
        yStep: 1,
      })
        .sort((a, b) => a.y - b.y || a.x - b.x)
        .map((item: any) => (
          <div className='w-full' key={item.id}>
            {onItemRender({ item })}
          </div>
        ))}
    </div>
  )
}
