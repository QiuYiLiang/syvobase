import { cn, useControllable, BaseInputProps } from '@/utils'
import BaseColorPicker from 'antd/es/color-picker'
import { mergeTag } from '@/utils/tag'
import { TRANSPARENT_COLOR, PRESET_COLORS, generateColorShades } from './shared'
import { ReactNode } from 'react'
import { Popover } from '@/popover'
import { Button } from '@/button'

export interface ColorPickerProps extends BaseInputProps<string> {
  children?: ReactNode
  presets?: string[]
}

export const ColorPicker = (props: ColorPickerProps) => {
  const {
    className,
    style,
    readMode,
    disabled,
    children,
    presets = PRESET_COLORS,
    ...rest
  } = props

  const [value, setValue] = useControllable<ColorPickerProps, 'value'>({
    props,
    value: '',
  })

  const colorShades = generateColorShades(presets)

  const isTransparent =
    value === TRANSPARENT_COLOR || value === 'transparent' || !value

  if (readMode) {
    return (
      <div
        className={cn('size-6 rounded', className)}
        style={{
          background: isTransparent ? undefined : value,
          backgroundImage: isTransparent
            ? 'repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 6px 6px'
            : undefined,
          ...style,
        }}
      />
    )
  }

  const trigger = (
    <Button
      type='outline'
      size='sm'
      disabled={disabled}
      className={cn('relative size-6 p-0', className)}
      style={{
        backgroundColor: isTransparent ? undefined : value,
        backgroundImage: isTransparent
          ? 'repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 6px 6px'
          : undefined,
        ...style,
      }}
    >
      {isTransparent && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='bg-destructive h-px w-full rotate-45' />
        </div>
      )}
    </Button>
  )

  const panel = (
    <div className='flex flex-col gap-3 p-3'>
      <div
        className='grid gap-x-1 gap-y-2'
        style={{
          gridTemplateColumns: `repeat(${colorShades.length}, 1fr)`,
          gridTemplateRows: `repeat(${colorShades[0]?.length || 5}, 1fr)`,
        }}
      >
        {colorShades[0]?.map((_, rowIndex) =>
          colorShades.map((colorGroup) => {
            const color = colorGroup[rowIndex]
            const isSelected = value === color
            return (
              <Button
                key={color}
                type='ghost'
                className={cn(
                  'size-5 min-h-0 min-w-0 rounded p-0 transition-all hover:z-10 hover:scale-110',
                  isSelected && 'ring-ring ring-2 ring-offset-1'
                )}
                style={{ backgroundColor: color }}
                onClick={() => setValue(color)}
              />
            )
          })
        )}
      </div>

      <div className='border-border flex items-center gap-2 border-t pt-3'>
        <Button
          type='outline'
          size='sm'
          className={cn(
            'relative size-6 p-0',
            isTransparent && 'ring-ring ring-2 ring-offset-1'
          )}
          style={{
            backgroundImage:
              'repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 6px 6px',
          }}
          onClick={() => setValue(TRANSPARENT_COLOR)}
        >
          <div className='bg-destructive absolute h-px w-full rotate-45' />
        </Button>

        <BaseColorPicker
          rootClassName='z-[99999999]'
          value={isTransparent ? undefined : value}
          onChange={(color) => {
            setValue(color.toHexString())
          }}
        >
          <div>
            <Button
              type='outline'
              size='sm'
              icon='Palette'
              onlyIcon
              className={cn(
                'size-6 p-0',
                !isTransparent &&
                  !colorShades.flat().includes(value) &&
                  'ring-ring ring-2 ring-offset-1'
              )}
            />
          </div>
        </BaseColorPicker>

        <div className='ml-auto flex items-center gap-3'>
          <div
            className='border-border size-6 rounded border'
            style={{
              backgroundColor: isTransparent ? undefined : value,
              backgroundImage: isTransparent
                ? 'repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 6px 6px'
                : undefined,
            }}
          />
          <span className='text-muted-foreground w-16 text-xs uppercase'>
            {isTransparent ? '透明' : value}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div {...mergeTag('color-picker', rest)}>
      <Popover
        align='left'
        direction='top'
        trigger='click'
        className='p-0'
        disabled={disabled}
        content={panel}
      >
        <div>{children || trigger}</div>
      </Popover>
    </div>
  )
}
