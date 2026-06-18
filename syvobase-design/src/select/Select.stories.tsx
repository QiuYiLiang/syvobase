import { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from '@/select'
import { useState } from 'react'

const meta = {
  title: 'Input/Select',
  component: Select,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // disabled: true,
    // readMode: true,
    allowClear: true,
    filterType: 'local',
    style: {
      width: 200,
    },
    value: '1',
    items: [
      {
        id: '1',
        name: '张三',
      },
      {
        id: '2',
        name: '李四',
      },
      {
        id: '3',
        name: '王五',
        parentId: '1',
      },
    ],
    onDisabledItem: (node) => {
      return node.data.id === '1'
    },
  },
  render(args: any) {
    const [value, setValue] = useState<string>('1')

    return (
      <Select
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}
export const Error: Story = {
  args: {
    // disabled: true,
    // readMode: true,
    allowClear: true,
    filterType: 'local',
    errorMsg: '哈哈哈',
    style: {
      width: 200,
    },
    value: '',
    items: [
      {
        id: '1',
        name: '张三',
      },
      {
        id: '2',
        name: '李四',
      },
      {
        id: '3',
        name: '王五',
        parentId: '1',
      },
    ],
    onDisabledItem: (node) => {
      return node.data.id === '1'
    },
  },
  render(args: any) {
    const [value, setValue] = useState('1')

    return (
      <Select
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}
export const Disabled: Story = {
  args: {
    // readMode: true,
    allowClear: true,
    filterType: 'local',
    style: {
      width: 200,
    },
    disabled: true,
    value: '',
    items: [
      {
        id: '1',
        name: '张三',
      },
      {
        id: '2',
        name: '李四',
      },
      {
        id: '3',
        name: '王五',
        parentId: '1',
      },
    ],
    onDisabledItem: (node) => {
      return node.data.id === '1'
    },
  },
  render(args: any) {
    const [value, setValue] = useState('1')

    return (
      <Select
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const TreeSelect: Story = {
  args: {
    allowClear: true,
    filterType: 'local',
    isTree: true,
    style: {
      width: 200,
    },
    value: '',
    items: [
      {
        id: '1',
        name: '张三',
      },
      {
        id: '2',
        name: '李四',
      },
      {
        id: '3',
        name: '王五',
        parentId: '1',
      },
    ],
    onDisabledItem: (node) => {
      return node.data.id === '1'
    },
  },
  render(args: any) {
    const [value, setValue] = useState('1')

    return (
      <Select
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const Multiple: Story = {
  args: {
    // disabled: true,
    // readMode: true,
    multiple: true,
    allowClear: true,
    filterType: 'local',
    isTree: true,
    style: {
      width: 200,
    },
    value: [],
    items: [
      {
        id: '1',
        name: '张三',
      },
      {
        id: '2',
        name: '李四',
      },
      {
        id: '3',
        name: '王五',
        parentId: '1',
      },
    ],
    onDisabledItem: (node) => {
      return node.data.id === '1'
    },
  },
  render(args: any) {
    const [value, setValue] = useState(['1'])

    return (
      <Select
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

const remoteData = [
  {
    id: 'lb',
    name: '刘备',
  },
  {
    id: 'gy',
    name: '关羽',
  },
  {
    id: 'zf',
    name: '张飞',
  },
]

export const Remote: Story = {
  args: {
    multiple: true,
    allowClear: true,
    filterType: 'remote',
    isTree: true,
    style: {
      width: 200,
    },
    value: [],
    // remote 类型必须有默认选项，用于展示默认值的文本
    items: [
      {
        id: '1',
        name: '张三',
      },
    ],
    onRemote: (keyword) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = remoteData.filter(({ name }) => name.includes(keyword))
          resolve(data)
        }, 500)
      })
    },
  },
  render(args: any) {
    const [value, setValue] = useState(['1'])

    return (
      <Select
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const ReadMode: Story = {
  args: {
    // disabled: true,
    readMode: true,
    multiple: true,
    allowClear: true,
    filterType: 'local',
    isTree: true,
    style: {
      width: 200,
    },
    value: [],
    items: [
      {
        id: '1',
        name: '张三',
      },
      {
        id: '2',
        name: '李四',
      },
      {
        id: '3',
        name: '王五',
        parentId: '1',
      },
    ],
    onDisabledItem: (node) => {
      return node.data.id === '1'
    },
  },
  render(args: any) {
    const [value, setValue] = useState(['1'])

    return (
      <Select
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}
