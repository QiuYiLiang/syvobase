import { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from '@/tabs'
import { useState } from 'react'

const meta = {
  title: 'Layout/Tabs',
  component: Tabs,
  argTypes: {},
  args: {
    value: 'tab2',
    items: [
      {
        id: 'tab1',
        name: '标签1',
        content: 'Tab1',
      },
      {
        id: 'tab2',
        name: '标签2',
        content: 'Tab2',
      },
      {
        id: 'tab3',
        name: '标签3',
        content: 'Tab3',
      },
      {
        id: 'tab4',
        name: '标签4',
        content: 'Tab4',
      },
      {
        id: 'tab5',
        name: '标签5',
        content: 'Tab5',
      },
      {
        id: 'tab6',
        name: '标签6',
        content: 'Tab6',
      },
      {
        id: 'tab7',
        name: '标签7',
        content: 'Tab7',
      },
    ],
  },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render(args) {
    const [value, setValue] = useState('tab1')
    return <Tabs {...args} value={value} onChange={setValue} />
  },
}

export const Left: Story = {
  args: {
    direction: 'left',
  },
}

export const Bottom: Story = {
  args: {
    direction: 'bottom',
  },
}

export const Right: Story = {
  args: {
    direction: 'right',
  },
}

export const Line: Story = {
  args: {},
  render(args) {
    const [value, setValue] = useState('tab1')
    return <Tabs type='line' {...args} value={value} onChange={setValue} />
  },
}

export const LeftLine: Story = {
  args: {
    type: 'line',
    direction: 'left',
  },
}

export const BottomLine: Story = {
  args: {
    type: 'line',
    direction: 'bottom',
  },
}

export const RightLine: Story = {
  args: {
    type: 'line',
    direction: 'right',
  },
}

export const Add: Story = {
  args: {},
  render(args) {
    const [value, setValue] = useState('tab1')
    return (
      <Tabs
        style={{
          width: 200,
          height: 100,
          background: 'red',
        }}
        {...args}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Close: Story = {
  args: {},
  render(args) {
    const [value, setValue] = useState('tab1')
    const [items, setItems] = useState(args.items)
    return (
      <Tabs
        style={{
          width: 200,
          height: 100,
          background: 'red',
        }}
        enabledClose
        {...args}
        items={items}
        onItemsChange={setItems}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Slide: Story = {
  args: {},
  render(args) {
    const [value, setValue] = useState('tab1')
    return (
      <Tabs
        style={{
          width: 400,
          height: 200,
          border: '1px solid #666',
          borderRadius: 8,
        }}
        {...args}
        items={[
          {
            id: 'tab1',
            name: '标签1',
            content: 'Tab1',
          },
          {
            id: 'tab2',
            name: '标签2',
            content: 'Tab2',
          },
          {
            id: 'tab3',
            name: '标签3',
            content: 'Tab3',
          },
          {
            id: 'tab4',
            name: '标签4',
            content: 'Tab4',
          },
          {
            id: 'tab5',
            name: '标签5',
            content: 'Tab5',
          },
          {
            id: 'tab6',
            name: '标签6',
            content: 'Tab6',
          },
          {
            id: 'tab7',
            name: '标签7',
            content: 'Tab7',
          },
          {
            id: 'tab8',
            name: '标签8',
            content: 'Tab8',
          },
          {
            id: 'tab9',
            name: '标签9',
            content: 'Tab9',
          },
        ]}
        direction='left'
        type='line'
        value={value}
        onChange={setValue}
      />
    )
  },
}
