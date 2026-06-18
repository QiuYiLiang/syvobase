import { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/button'
import { confirm } from './Confirm'

const meta = {
  title: 'Layout/Confirm',
  argTypes: {},
  args: {},
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

// 默认确认对话框
export const Default: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          confirm({
            header: '提示',
            children: '是否删除此项？',
            onConfirm: () => {
              console.log('已删除')
            },
          })
        }}
      >
        删除确认
      </Button>
    )
  },
}

// 带表单的确认对话框
export const WithForm: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          confirm({
            header: '新建用户',
            defaultValue: { name: '', email: '' },
            items: [
              {
                id: 'name',
                label: '用户名',
                control: 'text',
                rules: [{ required: true, message: '请输入用户名' }],
              },
              {
                id: 'email',
                label: '邮箱',
                control: 'text',
                rules: [{ required: true, message: '请输入邮箱' }],
              },
            ],
            onConfirm: (value) => {
              console.log('创建用户:', value)
            },
          })
        }}
      >
        新建用户
      </Button>
    )
  },
}

// 危险操作确认
export const DangerConfirm: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        type='destructive'
        onClick={() => {
          confirm({
            header: '⚠️ 危险操作',
            children: (
              <div className='space-y-2'>
                <p>您确定要删除所有数据吗？</p>
                <p className='text-destructive text-sm'>此操作不可恢复！</p>
              </div>
            ),
            onConfirm: () => {
              console.log('已删除所有数据')
            },
          })
        }}
      >
        删除所有数据
      </Button>
    )
  },
}

// 抽屉式确认
export const DrawerConfirm: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          confirm({
            header: '编辑信息',
            direction: 'right',
            defaultValue: { name: '张三', age: 25 },
            items: [
              {
                id: 'name',
                label: '姓名',
                control: 'text',
              },
              {
                id: 'age',
                label: '年龄',
                control: 'number',
              },
            ],
            onConfirm: (value) => {
              console.log('保存信息:', value)
            },
          })
        }}
      >
        侧边栏编辑
      </Button>
    )
  },
}

// 带额外工具栏按钮
export const WithExtraToolbar: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          confirm({
            header: '保存设置',
            children: '是否保存当前设置？',
            toolbar: [
              {
                name: '重置',
                type: 'ghost',
                onClick: () => {
                  console.log('重置设置')
                },
              },
            ],
            onConfirm: () => {
              console.log('保存设置')
            },
          })
        }}
      >
        带额外按钮
      </Button>
    )
  },
}

// 带关闭回调
export const WithCloseCallback: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          confirm({
            header: '提示',
            children: '关闭时会触发回调',
            onConfirm: () => {
              console.log('确认')
            },
            onClose: () => {
              console.log('取消或关闭')
            },
          })
        }}
      >
        带关闭回调
      </Button>
    )
  },
}

// 异步确认
export const AsyncConfirm: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          confirm({
            header: '提交数据',
            children: '确认提交数据？',
            onConfirm: async () => {
              // 模拟异步操作
              await new Promise((resolve) => setTimeout(resolve, 1000))
              console.log('提交成功')
            },
          })
        }}
      >
        异步确认
      </Button>
    )
  },
}

// 阻止关闭
export const PreventClose: Story = {
  args: {} as any,
  render() {
    return (
      <Button
        onClick={() => {
          confirm({
            header: '校验失败',
            children: '请输入正确的值后再提交',
            onConfirm: () => {
              // 返回 false 阻止对话框关闭
              return false
            },
          })
        }}
      >
        阻止关闭
      </Button>
    )
  },
}
