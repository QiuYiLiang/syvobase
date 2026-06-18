import { Meta, StoryObj } from '@storybook/react-vite'
import { Portal, PortalProps } from '@/portal'
import { Button } from '@/button'
import { useRef, useState, useEffect } from 'react'

const meta: Meta<typeof Portal> = {
  title: 'Base/Portal',
  component: Portal,
  argTypes: {},
}

export default meta

type Story = StoryObj<PortalProps>

// 默认 Portal（渲染到 body）
export const Default: Story = {
  args: {
    children: (
      <div className='bg-primary text-primary-foreground fixed right-4 bottom-4 rounded px-4 py-2 shadow-lg'>
        悬浮在右下角
      </div>
    ),
  },
}

// 基础用法
export const BasicUsage: Story = {
  render() {
    return (
      <div>
        <div className='rounded border p-4'>这是父容器的内容</div>
        <Portal>
          <div className='fixed top-4 right-4 rounded bg-blue-500 px-4 py-2 text-white shadow-lg'>
            我通过 Portal 渲染到了 body
          </div>
        </Portal>
      </div>
    )
  },
}

// 可控显示
export const Toggleable: Story = {
  render() {
    const [show, setShow] = useState(false)
    return (
      <div>
        <Button onClick={() => setShow(!show)}>
          {show ? '隐藏' : '显示'} Portal
        </Button>
        {show && (
          <Portal>
            <div className='fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border bg-white p-6 shadow-xl'>
              <div className='mb-2 font-semibold'>Portal 内容</div>
              <div className='text-muted-foreground mb-4'>
                这是通过 Portal 渲染的内容
              </div>
              <Button onClick={() => setShow(false)}>关闭</Button>
            </div>
          </Portal>
        )}
      </div>
    )
  },
}

// 渲染到指定容器
export const CustomContainer: Story = {
  render() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    return (
      <div className='space-y-4'>
        <div
          ref={containerRef}
          className='relative min-h-[100px] rounded border-2 border-dashed border-blue-400 p-4'
        >
          <div className='text-muted-foreground mb-2 text-sm'>
            这是指定的 Portal 容器
          </div>
          {/* Portal 内容会渲染到这里 */}
        </div>
        {mounted && containerRef.current && (
          <Portal container={containerRef.current}>
            <div className='mt-2 rounded bg-green-100 px-3 py-2 text-green-800'>
              我被渲染到了上面的容器中
            </div>
          </Portal>
        )}
      </div>
    )
  },
}

// 多个 Portal
export const MultiplePortals: Story = {
  render() {
    return (
      <div>
        <div className='rounded border p-4'>主内容区域</div>
        <Portal>
          <div className='fixed top-4 left-4 rounded bg-red-500 px-3 py-2 text-white shadow'>
            左上角
          </div>
        </Portal>
        <Portal>
          <div className='fixed top-4 right-4 rounded bg-blue-500 px-3 py-2 text-white shadow'>
            右上角
          </div>
        </Portal>
        <Portal>
          <div className='fixed bottom-4 left-4 rounded bg-green-500 px-3 py-2 text-white shadow'>
            左下角
          </div>
        </Portal>
        <Portal>
          <div className='fixed right-4 bottom-4 rounded bg-yellow-500 px-3 py-2 text-black shadow'>
            右下角
          </div>
        </Portal>
      </div>
    )
  },
}

// 模拟弹窗
export const ModalExample: Story = {
  render() {
    const [open, setOpen] = useState(false)
    return (
      <div>
        <Button onClick={() => setOpen(true)}>打开弹窗</Button>
        {open && (
          <Portal>
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
              <div className='mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
                <h2 className='mb-2 text-lg font-semibold'>弹窗标题</h2>
                <p className='text-muted-foreground mb-4'>
                  这是一个通过 Portal 实现的弹窗示例。Portal 确保弹窗内容渲染在
                  DOM 最外层， 避免被父元素的 overflow 或 z-index 影响。
                </p>
                <div className='flex justify-end gap-2'>
                  <Button type='outline' onClick={() => setOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={() => setOpen(false)}>确定</Button>
                </div>
              </div>
            </div>
          </Portal>
        )}
      </div>
    )
  },
}

// 通知示例
export const NotificationExample: Story = {
  render() {
    const [notifications, setNotifications] = useState<string[]>([])

    const addNotification = () => {
      const id = Date.now().toString()
      setNotifications((prev) => [...prev, id])
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== id))
      }, 3000)
    }

    return (
      <div>
        <Button onClick={addNotification}>添加通知</Button>
        <Portal>
          <div className='fixed top-4 right-4 z-50 space-y-2'>
            {notifications.map((id) => (
              <div
                key={id}
                className='animate-in slide-in-from-right rounded bg-green-500 px-4 py-3 text-white shadow-lg'
              >
                通知消息 #{id.slice(-4)}
              </div>
            ))}
          </div>
        </Portal>
      </div>
    )
  },
}
