import { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '@/textarea'
import { useState } from 'react'

const meta = {
  title: 'Input/Textarea',
  component: Textarea,
  argTypes: {
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    readMode: {
      control: 'boolean',
      description: '是否只读模式',
    },
    rows: {
      control: 'number',
      description: '行数',
    },
    cols: {
      control: 'number',
      description: '列数',
    },
    placeholder: {
      control: 'text',
      description: '占位文本',
    },
    inlineMode: {
      control: 'boolean',
      description: '内联模式（失焦时触发onChange）',
    },
  },
  args: {},
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

// 默认文本域
export const Default: Story = {
  args: {
    style: {
      width: 300,
    },
    placeholder: '请输入内容',
  },
  render(args) {
    const [value, setValue] = useState('')
    return <Textarea {...args} value={value} onChange={setValue} />
  },
}

// 带默认值
export const WithValue: Story = {
  args: {
    style: {
      width: 300,
    },
  },
  render(args) {
    const [value, setValue] = useState('这是一段默认文本')
    return <Textarea {...args} value={value} onChange={setValue} />
  },
}

// 禁用状态
export const Disabled: Story = {
  args: {
    disabled: true,
    style: {
      width: 300,
    },
  },
  render(args) {
    const [value, setValue] = useState('禁用状态的文本')
    return <Textarea {...args} value={value} onChange={setValue} />
  },
}

// 只读模式
export const ReadMode: Story = {
  args: {
    readMode: true,
  },
  render(args) {
    return <Textarea {...args} value='这是只读模式的文本，只会显示文本内容' />
  },
}

// 错误状态
export const Error: Story = {
  args: {
    style: {
      width: 300,
    },
    errorMsg: '内容不能为空',
  },
  render(args) {
    const [value, setValue] = useState('')
    return <Textarea {...args} value={value} onChange={setValue} />
  },
}

// 自定义行数
export const CustomRows: Story = {
  args: {
    rows: 6,
    style: {
      width: 300,
    },
    placeholder: '6行高度的文本域',
  },
  render(args) {
    const [value, setValue] = useState('')
    return <Textarea {...args} value={value} onChange={setValue} />
  },
}

// 内联模式
export const InlineMode: Story = {
  args: {
    inlineMode: true,
    style: {
      width: 300,
    },
    placeholder: '内联模式 - 失焦时触发onChange',
  },
  render(args) {
    const [value, setValue] = useState('')
    return (
      <div className='space-y-2'>
        <Textarea
          {...args}
          value={value}
          onChange={(val) => {
            setValue(val)
            console.log('onChange triggered:', val)
          }}
        />
        <div className='text-muted-foreground text-sm'>当前值: {value}</div>
      </div>
    )
  },
}

// 带验证规则
export const WithValidation: Story = {
  args: {
    rules: [
      {
        trigger: 'blur',
        validator: (value) => {
          if (!value || value.length < 10) {
            throw new Error('内容至少需要10个字符')
          }
        },
      },
    ],
    style: {
      width: 300,
    },
    placeholder: '请输入至少10个字符',
  },
  render(args) {
    const [value, setValue] = useState('')
    return <Textarea {...args} value={value} onChange={setValue} />
  },
}

// 长文本
export const LongText: Story = {
  args: {
    rows: 8,
    style: {
      width: 400,
    },
  },
  render(args) {
    const [value, setValue] = useState(
      `村里有个姑娘叫小芳
长得好看又善良
一双美丽的大眼睛
辫子粗又长

在回城之前的那个晚上
你和我来到小河旁
从没流过的泪水
随着小河淌

谢谢你给我的爱
今生今世我不忘怀
谢谢你给我的温柔
伴我度过那个年代`
    )
    return <Textarea {...args} value={value} onChange={setValue} />
  },
}

// 所有状态对比
export const AllStates: Story = {
  render: () => {
    const [value, setValue] = useState('示例文本')
    return (
      <div className='space-y-4'>
        <div className='flex gap-4'>
          <div>
            <div className='mb-1 text-sm font-medium'>正常</div>
            <Textarea
              style={{ width: 200 }}
              value={value}
              onChange={setValue}
            />
          </div>
          <div>
            <div className='mb-1 text-sm font-medium'>禁用</div>
            <Textarea style={{ width: 200 }} value={value} disabled />
          </div>
          <div>
            <div className='mb-1 text-sm font-medium'>错误</div>
            <Textarea
              style={{ width: 200 }}
              value={value}
              onChange={setValue}
              errorMsg='验证失败'
            />
          </div>
        </div>
      </div>
    )
  },
}
