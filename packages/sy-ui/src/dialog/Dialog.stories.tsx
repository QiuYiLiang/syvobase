import { Meta, StoryObj } from '@storybook/react-vite'

import { dialog, Dialog } from '@/dialog'
import { fn } from 'storybook/test'
import { Button } from '@/button'
import { Tabs } from '@/tabs'

const meta = {
  title: 'Layout/Dialog',
  component: Dialog,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Center: Story = {
  args: {
    open: true,
    header: '测试标题',
    footer: '测试底部',
    children: '测试内容',
    onOpenChange: fn(),
  },
}

export const Toolbar: Story = {
  args: {
    open: true,
    header: '提示',
    children: '确认删除？',
    toolbar: [
      {
        type: 'outline',
        name: '取消',
      },
      {
        name: '保存',
      },
    ],
    onOpenChange: fn(),
  },
}

export const Right: Story = {
  args: {
    direction: 'right',
    open: true,
    header: '测试标题',
    footer: '测试底部',
    children: '测试内容',
    onOpenChange: fn(),
  },
}

export const RightToolbar: Story = {
  args: {
    direction: 'right',
    open: true,
    header: '提示',
    children: '确认删除？',
    toolbar: {
      right: [
        {
          type: 'outline',
          name: '取消',
        },
        {
          name: '保存',
        },
      ],
    },

    onOpenChange: fn(),
  },
}

export const Api: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          dialog({
            direction: 'right',
            header: '提示',
            // children: '确认删除？',
            children: (
              <div>
                <Tabs
                  items={[
                    {
                      id: 'tab1',
                      name: '标签页1',
                    },
                  ]}
                />
              </div>
            ),
            toolbar: {
              right: [
                {
                  type: 'outline',
                  name: '取消',
                },
                {
                  name: '保存',
                },
              ],
            },
          })
        }}
      >
        弹出
      </Button>
    )
  },
}
