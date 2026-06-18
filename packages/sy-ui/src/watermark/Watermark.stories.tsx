import { Meta, StoryObj } from '@storybook/react-vite'

import { Watermark } from '@/watermark'
import { Button } from '@/button'

const meta = {
  title: 'Base/Watermark',
  component: Watermark,
  argTypes: {},
  args: {},
} satisfies Meta<typeof Watermark>

export default meta

type Story = StoryObj<typeof meta>

// 默认水印
export const Default: Story = {
  args: {
    content: '测试水印',
    children: (
      <div
        style={{
          width: 500,
          height: 300,
          background: '#f5f5f5',
        }}
      >
        <div className='p-4'>这里是内容区域</div>
      </div>
    ),
  },
}

// 多行水印
export const MultiLine: Story = {
  args: {
    content: ['NocoKit', '版权所有'],
    children: (
      <div
        style={{
          width: 500,
          height: 300,
          background: '#f5f5f5',
        }}
      >
        <div className='p-4'>多行水印内容</div>
      </div>
    ),
  },
}

// 自定义颜色
export const CustomColor: Story = {
  args: {
    content: '机密文档',
    font: {
      color: 'rgba(255, 0, 0, 0.15)',
    },
    children: (
      <div
        style={{
          width: 500,
          height: 300,
          background: '#f5f5f5',
        }}
      >
        <div className='p-4'>红色水印</div>
      </div>
    ),
  },
}

// 自定义字体大小
export const CustomFontSize: Story = {
  args: {
    content: '大号水印',
    font: {
      fontSize: 24,
    },
    children: (
      <div
        style={{
          width: 500,
          height: 300,
          background: '#f5f5f5',
        }}
      >
        <div className='p-4'>大字体水印</div>
      </div>
    ),
  },
}

// 旋转角度
export const RotateAngle: Story = {
  args: {
    content: '自定义角度',
    rotate: -15,
    children: (
      <div
        style={{
          width: 500,
          height: 300,
          background: '#f5f5f5',
        }}
      >
        <div className='p-4'>-15度旋转</div>
      </div>
    ),
  },
}

// 自定义间距
export const CustomGap: Story = {
  args: {
    content: '密集水印',
    gap: [50, 50],
    children: (
      <div
        style={{
          width: 500,
          height: 300,
          background: '#f5f5f5',
        }}
      >
        <div className='p-4'>较小间距的水印</div>
      </div>
    ),
  },
}

// 大间距
export const LargeGap: Story = {
  args: {
    content: '稀疏水印',
    gap: [200, 200],
    children: (
      <div
        style={{
          width: 500,
          height: 300,
          background: '#f5f5f5',
        }}
      >
        <div className='p-4'>较大间距的水印</div>
      </div>
    ),
  },
}

// 包含表单的内容
export const WithForm: Story = {
  args: {
    content: '内部使用',
    children: (
      <div
        style={{
          width: 500,
          height: 400,
          background: '#f5f5f5',
          padding: 20,
        }}
      >
        <div className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm font-medium'>用户名</label>
            <input
              className='w-full rounded border px-3 py-2'
              placeholder='请输入用户名'
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>密码</label>
            <input
              className='w-full rounded border px-3 py-2'
              type='password'
              placeholder='请输入密码'
            />
          </div>
          <Button>提交</Button>
        </div>
      </div>
    ),
  },
}

// 图片水印
export const ImageWatermark: Story = {
  args: {
    image:
      'https://gw.alipayobjects.com/zos/bmw-prod/59a18171-ae17-4571-b499-d0da1e71fa30.svg',
    height: 30,
    width: 130,
    children: (
      <div
        style={{
          width: 500,
          height: 300,
          background: '#f5f5f5',
        }}
      >
        <div className='p-4'>图片水印</div>
      </div>
    ),
  },
}

// Z-Index设置
export const ZIndex: Story = {
  args: {
    content: '高层级水印',
    zIndex: 100,
    children: (
      <div
        style={{
          width: 500,
          height: 300,
          background: '#f5f5f5',
          position: 'relative',
        }}
      >
        <div className='p-4'>水印在最上层</div>
        <Button>按钮会被水印覆盖</Button>
      </div>
    ),
  },
}

// 全屏水印示例
export const FullPage: Story = {
  render() {
    return (
      <Watermark content={['NocoKit', '2024-01-01']}>
        <div
          style={{
            width: '100%',
            height: 500,
            background: 'white',
            padding: 24,
          }}
        >
          <h1 className='mb-4 text-2xl font-bold'>文档标题</h1>
          <p className='mb-4 text-gray-600'>
            这是一段示例文档内容，用于展示全屏水印的效果。水印可以有效防止文档被截图传播。
          </p>
          <p className='mb-4 text-gray-600'>
            NocoKit 是一个现代化的 UI 组件库，提供丰富的组件和良好的开发体验。
          </p>
          <div className='flex gap-2'>
            <Button>保存</Button>
            <Button type='secondary'>取消</Button>
          </div>
        </div>
      </Watermark>
    )
  },
}
