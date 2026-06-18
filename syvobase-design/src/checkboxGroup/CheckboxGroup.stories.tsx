import { Meta, StoryObj } from '@storybook/react-vite'
import { CheckboxGroup } from '@/checkboxGroup'
import { useState } from 'react'

const meta = {
  title: 'Input/CheckboxGroup',
  component: CheckboxGroup,
  argTypes: {},
  args: {},
} satisfies Meta<typeof CheckboxGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // disabled: true,
    // readMode: true,
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
      <CheckboxGroup
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const Classic: Story = {
  args: {
    // disabled: true,
    // readMode: true,
    styleType: 'classic',
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
      <CheckboxGroup
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
    style: {
      width: 200,
    },
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
    const [value, setValue] = useState(['1', '2'])

    return (
      <CheckboxGroup
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const CheckboxGroupError: Story = {
  args: {
    // disabled: true,
    // readMode: true,
    style: {
      width: 200,
    },
    value: '',
    errorMsg: '哈哈哈',
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
      <CheckboxGroup
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const RadioGroup: Story = {
  args: {
    // disabled: true,
    // readMode: true,
    multiple: false,
    style: {
      width: 200,
    },
    value: '2',
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
      <CheckboxGroup
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const RadioGroupError: Story = {
  args: {
    // disabled: true,
    // readMode: true,
    errorMsg: '哈哈哈',
    multiple: false,
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
      <CheckboxGroup
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}
