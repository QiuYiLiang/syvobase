import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FileViewer } from '../FileViewer'

describe('FileViewer 文件预览组件', () => {
  const mockGetFileUrl = (file: { id: string; name: string }) =>
    `/files/${file.id}`

  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const files = [{ id: '1', name: 'test.png' }]
      const { container } = render(
        <FileViewer files={files} getFileUrl={mockGetFileUrl} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('多文件导航', () => {
    it('多个文件时应该显示上一个/下一个按钮', () => {
      const files = [
        { id: '1', name: 'image1.png' },
        { id: '2', name: 'image2.png' },
      ]
      const { container } = render(
        <FileViewer files={files} getFileUrl={mockGetFileUrl} />
      )
      const prevButton = container.querySelector('div[name="上一个"]')
      const nextButton = container.querySelector('div[name="下一个"]')
      expect(prevButton).toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()
    })

    it('第一个文件时上一个按钮应该禁用', () => {
      const files = [
        { id: '1', name: 'image1.png' },
        { id: '2', name: 'image2.png' },
      ]
      const { container } = render(
        <FileViewer
          files={files}
          getFileUrl={mockGetFileUrl}
          defaultCurrentFileId='1'
        />
      )
      const prevButton = container.querySelector('div[name="上一个"]')
      expect(prevButton).toHaveAttribute('disabled')
    })
  })

  describe('下载功能 (allowDownload)', () => {
    it('allowDownload 为 true 时应该显示下载按钮', () => {
      const files = [{ id: '1', name: 'test.png' }]
      const { container } = render(
        <FileViewer files={files} getFileUrl={mockGetFileUrl} allowDownload />
      )
      // 下载按钮使用 onlyIcon: true，只显示图标不显示文本
      // 查找带有 Download 图标的按钮（svg 元素在 button 中）
      const downloadButton = container.querySelector('svg')
      expect(downloadButton).toBeInTheDocument()
    })
  })

  describe('不支持的文件类型', () => {
    it('不支持的文件类型应该显示不支持提示', () => {
      const files = [{ id: '1', name: 'test.xyz' }]
      render(<FileViewer files={files} getFileUrl={mockGetFileUrl} />)
      expect(screen.getByText(/不支持|not support/i)).toBeInTheDocument()
    })
  })
})
