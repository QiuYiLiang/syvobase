import { ReactNode, RefAttributes } from 'react'
import { BaseInputModel, BaseInputProps, cn, useControllable } from '@/utils'
import { RangePicker, Picker, PickerProps as RCPickerProps } from 'rc-picker'
import dayjsGenerate from 'rc-picker/lib/generate/dayjs'
import { Button } from '@/button'
import { Icon } from '@/icon'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import { $t } from '@/utils/i18n'
import 'rc-picker/assets/index.css'
import './DatePicker.css'
import { mergeTag } from '@/utils/tag'

dayjs.extend(weekday)
dayjs.extend(localeData)

export interface DatePickerProps<V = any>
  extends BaseInputProps<V>, RefAttributes<BaseInputModel> {
  format?:
    | 'YYYY-MM-DD' // 日期
    | 'YYYY-MM' // 年月
    | 'YYYY' // 年
    | 'YYYY-MM-DD HH:mm:ss' // 日期时间（时分秒）
    | 'YYYY-MM-DD HH:mm' // 日期时间（时分）
    | 'HH:mm:ss' // 时间（时分秒）
    | 'HH:mm' // 时间（时分）
    | string
  range?: boolean
  presets?: RCPickerProps['presets']
  placeholder?: string | [string, string]
}

const ClearIcon = ({ value, onChange }: any) => {
  return (
    <div
      className={cn(value && 'cursor-pointer')}
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        value && onChange(null)
      }}
    >
      {value ? <Icon name='X' /> : <Icon name='Calendar' />}
    </div>
  )
}

export const DatePicker = ((props: DatePickerProps) => {
  const {
    className,
    style,
    range,
    format = 'YYYY-MM-DD',
    disabled = false,
    readMode = false,
    placeholder = '',
    presets = [],
  } = props
  const showTime = format.toLocaleLowerCase().includes('h')
  const [value, setValue] = useControllable<DatePickerProps, 'value'>({
    props,
    value: range ? [] : undefined,
  })
  if (range) {
    console.log(111, range ? [] : undefined, props, props.value, value)
  }

  if (readMode) {
    return value
      ? range
        ? `${value[0] ? dayjs(value[0]).format(format) : ''} ~ ${value[1] ? dayjs(value[1]).format(format) : ''}`
        : dayjs(value).format(format)
      : ''
  }

  const Root = range ? RangePicker : Picker
  const _value = range
    ? value.map((date) => (date ? dayjs(date) : date))
    : value
      ? dayjs(value)
      : value

  return (
    <Root
      {...mergeTag('date-picker', props)}
      className={cn('nk-date-picker', className)}
      style={style}
      presets={presets}
      showNow={false}
      value={_value}
      showTime={showTime}
      format={format}
      disabled={disabled}
      onChange={(value) => {
        setValue(value)
      }}
      placeholder={placeholder as any}
      superPrevIcon={
        <Button type='outline' className='mr-1' icon='ChevronsLeft' />
      }
      needConfirm={false}
      prevIcon={<Button type='outline' icon='ChevronLeft' />}
      nextIcon={<Button type='outline' icon='ChevronRight' />}
      superNextIcon={
        <Button type='outline' className='ml-1' icon='ChevronsRight' />
      }
      allowClear={false}
      suffixIcon={<ClearIcon value={value} onChange={setValue} />}
      getPopupContainer={() => {
        return document.body
      }}
      prefixCls='nk-date-picker'
      locale={{
        locale: 'zh_CN',
        today: $t('datePicker.today'),
        now: $t('datePicker.now'),
        backToToday: $t('datePicker.backToToday'),
        ok: $t('datePicker.ok'),
        timeSelect: $t('datePicker.timeSelect'),
        dateSelect: $t('datePicker.dateSelect'),
        weekSelect: $t('datePicker.weekSelect'),
        clear: $t('datePicker.clear'),
        week: $t('datePicker.week'),
        month: $t('datePicker.month'),
        year: $t('datePicker.year'),
        previousMonth: $t('datePicker.previousMonth'),
        nextMonth: $t('datePicker.nextMonth'),
        monthSelect: $t('datePicker.nextMonth'),
        yearSelect: $t('datePicker.yearSelect'),
        decadeSelect: $t('datePicker.decadeSelect'),
        previousYear: $t('datePicker.previousYear'),
        nextYear: $t('datePicker.nextYear'),
        previousDecade: $t('datePicker.previousDecade'),
        nextDecade: $t('datePicker.nextDecade'),
        previousCentury: $t('datePicker.previousCentury'),
        nextCentury: $t('datePicker.nextCentury'),
        yearFormat: $t('datePicker.yearFormat'),
        cellDateFormat: 'D',
        monthBeforeYear: false,
      }}
      generateConfig={dayjsGenerate}
    />
  )
}) as <V = any>(props: DatePickerProps<V>) => ReactNode
