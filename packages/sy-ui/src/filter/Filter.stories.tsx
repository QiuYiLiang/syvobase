import { Meta, StoryObj } from '@storybook/react-vite'
import { Filter } from '@/filter'
import { useState } from 'react'
import { getFilterOptionsMap, GetFilterOptionsItem, opItems } from './shared'

const meta = {
  title: 'Advanced/Filter',
  component: Filter,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Filter>

export default meta

type Story = StoryObj<typeof meta>

const filterValue = {
  // op 操作符
  op: 'and',
  // 有 children 代表分组
  items: [
    {
      // 左值
      left: 'a',
      // 比较符
      op: 'eq',
      // 右值
      right: '1',
    },
    {
      left: 'b',
      op: 'in',
      right: '2',
    },
    {
      op: 'or',
      items: [
        {
          left: 'c',
          op: 'less',
          right: '1',
        },
        {
          left: 'd',
          op: 'less',
          right: '3',
        },
      ],
    },
  ],
}

const opsMap = {
  a: ['in', 'notIn', 'between'],
  b: ['like', 'notLike'],
}

const presetsMap = {
  a: [
    { value: { op: 'between', right: [1, 100] }, name: '1-100' },
    { value: { op: 'between', right: [100, 200] }, name: '100-200' },
    { value: { op: 'between', right: [200, 500] }, name: '200-500' },
  ],
}

const items = [
  { id: 'zhangsan', name: '张三' },
  { id: 'lisi', name: '李四' },
  { id: 'wangwu', name: '王五' },
]

const fields: GetFilterOptionsItem[] = [
  {
    id: 'checkbox',
    name: 'checkbox',
    control: {
      type: 'checkbox',
    },
  },
  {
    id: 'checkboxGroup',
    name: 'checkboxGroup',
    control: {
      type: 'checkboxGroup',
      items,
    },
  },
  {
    id: 'checkboxGroup(multiple)',
    name: 'checkboxGroup(multiple)',
    control: {
      type: 'checkboxGroup',
      multiple: true,
      items,
    },
  },
  {
    id: 'colorPicker',
    name: 'colorPicker',
    control: {
      type: 'colorPicker',
    },
  },
  {
    id: 'draw',
    name: 'draw',
    control: {
      type: 'draw',
    },
  },
  {
    id: 'mindmap',
    name: 'mindmap',
    control: {
      type: 'mindmap',
    },
  },
  {
    id: 'number',
    name: 'number',
    control: {
      type: 'number',
    },
  },
  {
    id: 'opt',
    name: 'opt',
    control: {
      type: 'opt',
    },
  },
  {
    id: 'password',
    name: 'password',
    control: {
      type: 'password',
    },
  },
  {
    id: 'qrcode',
    name: 'qrcode',
    control: {
      type: 'qrcode',
    },
  },
  {
    id: 'select',
    name: 'select',
    control: {
      type: 'select',
      items,
    },
  },
  {
    id: 'select(multiple)',
    name: 'select(multiple)',
    control: {
      type: 'select',
      multiple: true,
      items,
    },
  },
  {
    id: 'switch',
    name: 'switch',
    control: {
      type: 'switch',
    },
  },
  {
    id: 'textarea',
    name: 'textarea',
    control: {
      type: 'textarea',
    },
  },

  {
    id: 'text',
    name: 'text',
    control: {
      type: 'text',
    },
  },
  {
    id: 'datePicker',
    name: 'datePicker',
    control: {
      type: 'datePicker',
    },
  },
  {
    id: 'file',
    name: 'file',
    control: {
      type: 'file',
    },
  },
]

export const Default: Story = {
  render() {
    const [value, setValue] = useState<any>(filterValue)
    return (
      <Filter
        left={{
          type: 'select',
          items: [
            {
              id: 'a',
              name: 'a',
            },
            {
              id: 'b',
              name: 'b',
            },
          ],
        }}
        op={({ left }) => ({
          type: 'select',
          items: opItems.filter(({ id }) => (opsMap[left] ?? []).includes(id)),
        })}
        right={({ op }) => {
          if (op === 'between') {
            return {
              type: 'number',
              between: true,
            }
          }
          return {
            type: 'text',
          }
        }}
        getPresets={({ left }) => {
          return presetsMap[left]
        }}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const Simple: Story = {
  render() {
    const [value, setValue] = useState<any>(filterValue)
    return (
      <Filter
        border={false}
        mode='simple'
        left={{
          type: 'select',
          items: [
            {
              id: 'a',
              name: 'a',
            },
            {
              id: 'b',
              name: 'b',
            },
          ],
          tagGroup: {
            noStyle: true,
          },
        }}
        op={({ left }) => ({
          type: 'select',
          items: opItems.filter(({ id }) => (opsMap[left] ?? []).includes(id)),
        })}
        right={({ op }) => {
          if (op === 'between') {
            return {
              type: 'number',
              between: true,
            }
          }
          return {
            type: 'text',
          }
        }}
        getPresets={({ left }) => {
          return presetsMap[left]
        }}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}

export const Standard: Story = {
  render() {
    const [value, setValue] = useState<any>(filterValue)
    const filterOptionsMap = getFilterOptionsMap({
      items: fields,
    })
    return (
      <Filter
        left={{
          type: 'select',
          items: fields,
        }}
        op={({ left }) => ({
          type: 'select',
          items: filterOptionsMap[left]?.opItems ?? [],
        })}
        right={({ left, op }) => {
          return filterOptionsMap[left]?.opRightMap[op]
        }}
        value={value}
        onChange={(value) => {
          setValue(value)
        }}
      />
    )
  },
}
