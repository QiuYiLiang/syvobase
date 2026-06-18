import { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/button'
import { message } from './shared'

const meta = {
  title: 'base/Message',
  argTypes: {},
  args: {},
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

// 成功提示
export const Success: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          message.success('操作成功！')
        }}
      >
        成功提示
      </Button>
    )
  },
}

// 错误提示
export const Error: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        type='destructive'
        onClick={() => {
          message.error('操作失败！')
        }}
      >
        错误提示
      </Button>
    )
  },
}

// 警告提示
export const Warning: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        type='outline'
        onClick={() => {
          message.warning('请注意！')
        }}
      >
        警告提示
      </Button>
    )
  },
}

// 信息提示
export const Info: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        type='secondary'
        onClick={() => {
          message.info('这是一条信息')
        }}
      >
        信息提示
      </Button>
    )
  },
}

// 加载中
export const Loading: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          const id = message.loading('加载中...')
          setTimeout(() => {
            message.dismiss(id)
            message.success('加载完成！')
          }, 2000)
        }}
      >
        加载提示
      </Button>
    )
  },
}

// 所有类型
export const AllTypes: Story = {
  args: {} as any,
  render() {
    return (
      <div className='flex gap-2'>
        <Button
          onClick={() => {
            message.success('成功')
          }}
        >
          成功
        </Button>
        <Button
          type='destructive'
          onClick={() => {
            message.error('错误')
          }}
        >
          错误
        </Button>
        <Button
          type='outline'
          onClick={() => {
            message.warning('警告')
          }}
        >
          警告
        </Button>
        <Button
          type='secondary'
          onClick={() => {
            message.info('信息')
          }}
        >
          信息
        </Button>
      </div>
    )
  },
}

// 自定义消息
export const CustomMessage: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          message.message('这是一条普通消息', {
            description: '带有描述信息的消息',
          })
        }}
      >
        自定义消息
      </Button>
    )
  },
}
