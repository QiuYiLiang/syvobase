import { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from '@/datePicker'
import { fn } from 'storybook/test'
import dayjs from 'dayjs'
import { useState } from 'react'

const meta = {
  title: 'Input/DatePicker',
  component: DatePicker,
  argTypes: {
    format: {
      control: 'select',
      options: [
        'YYYY-MM-DD',
        'YYYY-MM',
        'YYYY',
        'YYYY-MM-DD HH:mm:ss',
        'YYYY-MM-DD HH:mm',
        'HH:mm:ss',
        'HH:mm',
      ],
      description: '日期格式',
    },
    range: {
      control: 'boolean',
      description: '是否范围选择',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    readMode: {
      control: 'boolean',
      description: '是否只读模式',
    },
  },
  args: {},
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

// 默认日期选择器
export const Default: Story = {
  args: {
    placeholder: '请选择日期',
    onChange: fn(),
  } as any,
}

// 带默认值
export const WithValue: Story = {
  args: {
    value: dayjs(),
    onChange: fn(),
  } as any,
}

// 受控模式
export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState(dayjs())
    return (
      <div className='space-y-2'>
        <DatePicker value={date} onChange={setDate} />
        <div className='text-muted-foreground text-sm'>
          当前选择: {date?.format('YYYY-MM-DD')}
        </div>
      </div>
    )
  },
}

// 禁用状态
export const Disabled: Story = {
  args: {
    placeholder: '请选择日期',
    disabled: true,
    value: dayjs(),
  } as any,
}

// 年份选择
export const YearPicker: Story = {
  args: {
    placeholder: '请选择年份',
    format: 'YYYY',
  } as any,
}

// 年月选择
export const MonthPicker: Story = {
  args: {
    placeholder: '请选择年月',
    format: 'YYYY-MM',
  } as any,
}

// 带预设选项
export const Presets: Story = {
  args: {
    value: dayjs(),
    onChange: fn(),
    presets: [
      { label: '今天', value: dayjs() },
      { label: '昨天', value: dayjs().subtract(1, 'day') },
      { label: '一周前', value: dayjs().subtract(7, 'day') },
      { label: '一个月前', value: dayjs().subtract(1, 'month') },
    ],
  } as any,
}

// 日期时间选择
export const DateTime: Story = {
  args: {
    value: dayjs(),
    onChange: fn(),
    format: 'YYYY-MM-DD HH:mm:ss',
  } as any,
}

// 日期时间（时分）
export const DateTimeMinute: Story = {
  args: {
    value: dayjs(),
    onChange: fn(),
    format: 'YYYY-MM-DD HH:mm',
  } as any,
}

// 时间选择（时分秒）
export const TimePicker: Story = {
  args: {
    value: dayjs(),
    onChange: fn(),
    format: 'HH:mm:ss',
  } as any,
}

// 时间选择（时分）
export const TimePickerMinute: Story = {
  args: {
    value: dayjs(),
    onChange: fn(),
    format: 'HH:mm',
  } as any,
}

// 日期时间只读模式
export const DateTimeReadMode: Story = {
  args: {
    readMode: true,
    value: dayjs(),
    format: 'YYYY-MM-DD HH:mm:ss',
  } as any,
}

// 日期范围选择
export const DateRange: Story = {
  args: {
    placeholder: ['请选择开始日期', '请选择结束日期'],
    onChange: fn(),
    range: true,
  } as any,
}

// 日期范围带默认值
export const DateRangeWithValue: Story = {
  args: {
    value: [dayjs(), dayjs().add(7, 'day')],
    onChange: fn(),
    range: true,
  } as any,
}

// 日期时间范围选择
export const DateTimeRange: Story = {
  args: {
    value: [dayjs(), dayjs().add(1, 'd')],
    onChange: fn(),
    range: true,
    format: 'YYYY-MM-DD HH:mm:ss',
  } as any,
}

// 日期时间范围只读模式
export const DateTimeRangeReadMode: Story = {
  args: {
    readMode: true,
    value: [dayjs(), dayjs().add(1, 'd')],
    range: true,
    format: 'YYYY-MM-DD HH:mm:ss',
  } as any,
}

// 年月范围选择
export const MonthRange: Story = {
  args: {
    placeholder: ['开始月份', '结束月份'],
    range: true,
    format: 'YYYY-MM',
  } as any,
}

// 所有格式对比
export const AllFormats: Story = {
  render: () => (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <span className='w-32'>日期:</span>
        <DatePicker format='YYYY-MM-DD' placeholder='YYYY-MM-DD' />
      </div>
      <div className='flex items-center gap-4'>
        <span className='w-32'>年月:</span>
        <DatePicker format='YYYY-MM' placeholder='YYYY-MM' />
      </div>
      <div className='flex items-center gap-4'>
        <span className='w-32'>年份:</span>
        <DatePicker format='YYYY' placeholder='YYYY' />
      </div>
      <div className='flex items-center gap-4'>
        <span className='w-32'>日期时间:</span>
        <DatePicker
          format='YYYY-MM-DD HH:mm:ss'
          placeholder='YYYY-MM-DD HH:mm:ss'
        />
      </div>
      <div className='flex items-center gap-4'>
        <span className='w-32'>时间:</span>
        <DatePicker format='HH:mm:ss' placeholder='HH:mm:ss' />
      </div>
    </div>
  ),
}
