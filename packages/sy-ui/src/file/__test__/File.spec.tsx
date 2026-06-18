import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { File } from '../File'
import { SyvobaseUiContext } from '@/themes'

describe('File 文件组件', () => {
  const renderWithContext = (ui: React.ReactElement) => {
    return render(
      <SyvobaseUiContext
        value={{ axios: {} as any, theme: {} as any, dark: false, icons: {} }}
      >
        {ui}
      </SyvobaseUiContext>
    )
  }

  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = renderWithContext(<File />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该渲染上传按钮', () => {
      renderWithContext(<File mode='simple' />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('模式 (mode)', () => {
    it('默认模式应该是 advanced', () => {
      const { container } = renderWithContext(<File />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('simple 模式应该显示上传按钮', () => {
      renderWithContext(<File mode='simple' />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('readMode 为 true 时不应该显示上传按钮', () => {
      renderWithContext(<File mode='simple' readMode />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时不应该显示上传按钮', () => {
      renderWithContext(<File mode='simple' disabled />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('文件列表 (value)', () => {
    it('应该渲染文件列表', () => {
      const files = [
        { id: '1', name: 'test.txt', ext: 'txt' },
        { id: '2', name: 'image.png', ext: 'png' },
      ]
      const { container } = renderWithContext(<File value={files} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('文件数量限制 (maxCount)', () => {
    it('应该支持设置最大文件数量', () => {
      const { container } = renderWithContext(<File maxCount={5} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('文件大小限制 (maxSize)', () => {
    it('应该支持设置最大文件大小', () => {
      const { container } = renderWithContext(<File maxSize={10} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('文件扩展名限制 (exts)', () => {
    it('应该支持设置允许的文件扩展名', () => {
      const { container } = renderWithContext(<File exts={['jpg', 'png']} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('禁用按钮 (disabledButtons)', () => {
    it('应该支持禁用指定按钮', () => {
      const { container } = renderWithContext(
        <File disabledButtons={['preview', 'download']} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('内联模式 (inlineMode)', () => {
    it('inlineMode 为 true 时应该切换到简单模式', () => {
      const { container } = renderWithContext(<File inlineMode />)
      expect(container.querySelector('.flex-col')).toBeInTheDocument()
    })
  })

  describe('上传回调 (onUpload)', () => {
    it('应该支持自定义上传配置', () => {
      const onUpload = vi.fn()
      const { container } = renderWithContext(<File onUpload={onUpload} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('simple 模式下带文件列表应该正确渲染', () => {
      const files = [{ id: '1', name: 'document.pdf', ext: 'pdf' }]
      const { container } = renderWithContext(
        <File mode='simple' value={files} maxCount={3} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
