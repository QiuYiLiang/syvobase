import { Meta, StoryObj } from '@storybook/react-vite'

import { File } from '@/file'
import { useState } from 'react'
import { FileDataType } from '@/utils'

const meta = {
  title: 'Input/File',
  component: File,
  argTypes: {
    mode: {
      control: 'select',
      options: ['advanced', 'simple'],
    },
    maxCount: {
      control: 'number',
    },
    maxSize: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
    readMode: {
      control: 'boolean',
    },
    local: {
      control: 'boolean',
    },
  },
  args: {},
} satisfies Meta<typeof File>

export default meta

type Story = StoryObj<typeof meta>

const files: FileDataType[] = [
  { id: '1', name: '测试文件.txt' },
  { id: '2', name: '测试图片.png' },
  { id: '3', name: '测试视频.mp4' },
  { id: '4', name: '测试音频.mp3' },
  { id: '5', name: '测试文档.docx' },
  { id: '6', name: '测试表格.xlsx' },
  { id: '7', name: '测试幻灯片.pptx' },
]

// 高级模式 - 默认
export const Default: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>([
      { id: '1', name: '测试 Word.docx' },
      { id: '2', name: '测试音频.mp3' },
      { id: '3', name: '测试图片.png' },
    ])
    return (
      <File
        disabledButtons={[]}
        value={value}
        onChange={setValue}
        getImageUrl={({ id }) => {
          if (id === '3') {
            return 'https://pic.netbian.com/uploads/allimg/240528/213609-17169033698cd1.jpg'
          }
        }}
        getFileUrl={() => ''}
      />
    )
  },
}

// 简单模式
export const Simple: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>(files)
    return <File mode='simple' value={value} onChange={setValue} />
  },
}

// 空状态
export const Empty: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>([])
    return <File value={value} onChange={setValue} />
  },
}

// 单文件
export const SingleFile: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>([
      { id: '1', name: '项目计划.docx' },
    ])
    return <File maxCount={1} value={value} onChange={setValue} />
  },
}

// 多种文件类型
export const MultipleFileTypes: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>([
      { id: '1', name: '报告.docx' },
      { id: '2', name: '数据.xlsx' },
      { id: '3', name: '演示.pptx' },
      { id: '4', name: '说明.pdf' },
      { id: '5', name: '截图.png' },
      { id: '6', name: '录屏.mp4' },
      { id: '7', name: '录音.mp3' },
      { id: '8', name: '压缩包.zip' },
    ])
    return <File value={value} onChange={setValue} />
  },
}

// 禁用状态
export const Disabled: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>(files.slice(0, 3))
    return <File disabled value={value} onChange={setValue} />
  },
}

// 只读模式
export const ReadMode: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>(files.slice(0, 4))
    return <File readMode value={value} onChange={setValue} />
  },
}

// 简单模式 - 禁用
export const SimpleDisabled: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>(files.slice(0, 3))
    return <File disabled mode='simple' value={value} onChange={setValue} />
  },
}

// 简单模式 - 只读
export const SimpleReadMode: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>(files.slice(0, 3))
    return <File readMode mode='simple' value={value} onChange={setValue} />
  },
}

// 限制文件数量
export const MaxCount: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>([
      { id: '1', name: '文件1.docx' },
      { id: '2', name: '文件2.xlsx' },
    ])
    return (
      <div className='flex flex-col gap-2'>
        <div className='text-muted-foreground text-sm'>最多上传 3 个文件</div>
        <File maxCount={3} value={value} onChange={setValue} />
      </div>
    )
  },
}

// 限制文件类型
export const LimitedExtensions: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>([])
    return (
      <div className='flex flex-col gap-2'>
        <div className='text-muted-foreground text-sm'>
          仅支持 .jpg, .png, .gif 格式
        </div>
        <File exts={['jpg', 'png', 'gif']} value={value} onChange={setValue} />
      </div>
    )
  },
}

// 限制文件大小
export const LimitedSize: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>([])
    return (
      <div className='flex flex-col gap-2'>
        <div className='text-muted-foreground text-sm'>单个文件最大 5MB</div>
        <File maxSize={5} value={value} onChange={setValue} />
      </div>
    )
  },
}

// 本地模式（不上传）
export const LocalMode: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>([])
    return (
      <div className='flex flex-col gap-2'>
        <div className='text-muted-foreground text-sm'>
          本地模式 - 文件不会上传到服务器
        </div>
        <File local value={value} onChange={setValue} />
      </div>
    )
  },
}

// 内联模式
export const InlineMode: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>(files.slice(0, 3))
    return (
      <div className='w-[400px] rounded border p-4'>
        <div className='mb-2 text-sm font-medium'>附件</div>
        <File inlineMode value={value} onChange={setValue} />
      </div>
    )
  },
}

// 禁用特定按钮
export const DisabledButtons: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>(files.slice(0, 3))
    return (
      <div className='flex flex-col gap-4'>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>禁用预览按钮</div>
          <File
            disabledButtons={['preview']}
            value={value}
            onChange={setValue}
          />
        </div>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>禁用下载按钮</div>
          <File
            disabledButtons={['download']}
            value={value}
            onChange={setValue}
          />
        </div>
        <div>
          <div className='text-muted-foreground mb-2 text-sm'>禁用编辑按钮</div>
          <File disabledButtons={['edit']} value={value} onChange={setValue} />
        </div>
      </div>
    )
  },
}

// 完整功能示例
export const FullFeatured: Story = {
  render() {
    const [value, setValue] = useState<FileDataType[]>([
      { id: '1', name: '测试 Word.docx' },
      { id: '2', name: '测试音频.mp3' },
      { id: '3', name: '测试图片.png' },
      { id: '4', name: '测试视频.mp4' },
      { id: '5', name: '测试 Xlsx.xlsx' },
      { id: '6', name: '测试 PPT.pptx' },
      { id: '7', name: '测试 PDF.pdf' },
    ])
    return (
      <File
        disabledButtons={[]}
        value={value}
        onChange={setValue}
        getImageUrl={({ id }) => {
          if (id === '3') {
            return 'https://pic.netbian.com/uploads/allimg/240528/213609-17169033698cd1.jpg'
          }
        }}
        getFileUrl={({ id }) => {
          if (id === '1') {
            return 'https://raw.githubusercontent.com/zsmhub/document_template/refs/heads/master/%E6%B5%8B%E8%AF%95%E6%8A%A5%E5%91%8A%E6%A8%A1%E6%9D%BF-%E7%AE%80%E5%8D%95%E7%89%88.docx'
          }
          if (id === '2') {
            return 'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3'
          }
          if (id === '3') {
            return 'https://pic.netbian.com/uploads/allimg/240528/213609-17169033698cd1.jpg'
          }
          if (id === '4') {
            return 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
          }
          return ''
        }}
      />
    )
  },
}

// 两种模式对比
export const ModeComparison: Story = {
  render() {
    const [value1, setValue1] = useState<FileDataType[]>(files.slice(0, 4))
    const [value2, setValue2] = useState<FileDataType[]>(files.slice(0, 4))
    return (
      <div className='flex flex-col gap-8'>
        <div>
          <div className='mb-2 text-sm font-medium'>
            高级模式 (mode="advanced")
          </div>
          <File mode='advanced' value={value1} onChange={setValue1} />
        </div>
        <div>
          <div className='mb-2 text-sm font-medium'>
            简单模式 (mode="simple")
          </div>
          <File mode='simple' value={value2} onChange={setValue2} />
        </div>
      </div>
    )
  },
}
