import { cn } from '@/utils'

export interface RadiusSliderProps {
  value?: number
  onChange?: (value: number) => void
  disabled?: boolean
}

export const RadiusSlider = ({
  value,
  onChange,
  disabled,
}: RadiusSliderProps) => {
  // 使用 undefined/null 检查，而非 falsy 检查，以支持 0 值
  const actualValue = value ?? 0.375

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    onChange?.(newValue)
  }

  return (
    <div className='flex w-full min-w-[200px] flex-col gap-2 py-1'>
      {/* 滑块和当前值 */}
      <div className='flex items-center gap-2'>
        <input
          type='range'
          min='0'
          max='1'
          step='0.025'
          value={actualValue}
          onChange={handleSliderChange}
          disabled={disabled}
          className={cn(
            'h-2 w-full cursor-pointer appearance-none rounded-lg',
            'bg-muted',
            '[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        />
        <span className='text-foreground w-16 text-right text-sm font-medium'>
          {actualValue}rem
        </span>
      </div>
    </div>
  )
}
