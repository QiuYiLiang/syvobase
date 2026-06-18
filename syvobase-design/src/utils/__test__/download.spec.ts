import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { download } from '../download'

describe('download 下载函数', () => {
  let createElementSpy: any
  let appendChildSpy: any
  let removeChildSpy: any
  let revokeObjectURLSpy: any
  let mockAnchor: Partial<HTMLAnchorElement>

  beforeEach(() => {
    // 创建模拟的 anchor 元素
    mockAnchor = {
      style: { display: '' } as CSSStyleDeclaration,
      href: '',
      target: '',
      rel: '',
      download: '',
      click: vi.fn(),
    }

    createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(mockAnchor as HTMLAnchorElement)
    appendChildSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation(() => mockAnchor as Node)
    removeChildSpy = vi
      .spyOn(document.body, 'removeChild')
      .mockImplementation(() => mockAnchor as Node)
    revokeObjectURLSpy = vi
      .spyOn(window.URL, 'revokeObjectURL')
      .mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('基础功能', () => {
    it('应该创建一个 a 标签元素', async () => {
      await download({
        url: 'http://example.com/file.pdf',
        fileName: 'test.pdf',
      })
      expect(createElementSpy).toHaveBeenCalledWith('a')
    })

    it('应该设置正确的 href', async () => {
      const url = 'http://example.com/file.pdf'
      await download({ url, fileName: 'test.pdf' })
      expect(mockAnchor.href).toBe(url)
    })

    it('应该设置正确的 download 属性', async () => {
      const fileName = 'test.pdf'
      await download({ url: 'http://example.com/file.pdf', fileName })
      expect(mockAnchor.download).toBe(fileName)
    })

    it('应该设置 target 为 _blank', async () => {
      await download({
        url: 'http://example.com/file.pdf',
        fileName: 'test.pdf',
      })
      expect(mockAnchor.target).toBe('_blank')
    })

    it('应该设置 rel 为 noopener noreferrer', async () => {
      await download({
        url: 'http://example.com/file.pdf',
        fileName: 'test.pdf',
      })
      expect(mockAnchor.rel).toBe('noopener noreferrer')
    })

    it('应该隐藏 a 标签', async () => {
      await download({
        url: 'http://example.com/file.pdf',
        fileName: 'test.pdf',
      })
      expect(mockAnchor.style?.display).toBe('none')
    })
  })

  describe('DOM 操作', () => {
    it('应该将 a 标签添加到 body', async () => {
      await download({
        url: 'http://example.com/file.pdf',
        fileName: 'test.pdf',
      })
      expect(appendChildSpy).toHaveBeenCalledWith(mockAnchor)
    })

    it('应该触发点击事件', async () => {
      await download({
        url: 'http://example.com/file.pdf',
        fileName: 'test.pdf',
      })
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('应该在点击后移除 a 标签', async () => {
      await download({
        url: 'http://example.com/file.pdf',
        fileName: 'test.pdf',
      })
      expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor)
    })

    it('应该在下载后释放 URL 对象', async () => {
      const url = 'blob:http://example.com/12345'
      await download({ url, fileName: 'test.pdf' })
      expect(revokeObjectURLSpy).toHaveBeenCalledWith(url)
    })
  })

  describe('不同文件类型', () => {
    it('应该能下载 PDF 文件', async () => {
      await download({
        url: 'http://example.com/document.pdf',
        fileName: 'document.pdf',
      })
      expect(mockAnchor.download).toBe('document.pdf')
    })

    it('应该能下载图片文件', async () => {
      await download({
        url: 'http://example.com/image.png',
        fileName: 'image.png',
      })
      expect(mockAnchor.download).toBe('image.png')
    })

    it('应该能下载 Excel 文件', async () => {
      await download({
        url: 'http://example.com/data.xlsx',
        fileName: 'data.xlsx',
      })
      expect(mockAnchor.download).toBe('data.xlsx')
    })

    it('应该能下载 Word 文件', async () => {
      await download({
        url: 'http://example.com/document.docx',
        fileName: 'document.docx',
      })
      expect(mockAnchor.download).toBe('document.docx')
    })

    it('应该能下载 ZIP 文件', async () => {
      await download({
        url: 'http://example.com/archive.zip',
        fileName: 'archive.zip',
      })
      expect(mockAnchor.download).toBe('archive.zip')
    })
  })

  describe('特殊 URL 类型', () => {
    it('应该处理 Blob URL', async () => {
      const blobUrl = 'blob:http://localhost:3000/12345-67890'
      await download({ url: blobUrl, fileName: 'file.txt' })
      expect(mockAnchor.href).toBe(blobUrl)
    })

    it('应该处理 Data URL', async () => {
      const dataUrl = 'data:text/plain;base64,SGVsbG8gV29ybGQ='
      await download({ url: dataUrl, fileName: 'hello.txt' })
      expect(mockAnchor.href).toBe(dataUrl)
    })

    it('应该处理带查询参数的 URL', async () => {
      const urlWithParams = 'http://example.com/file.pdf?token=abc123'
      await download({ url: urlWithParams, fileName: 'file.pdf' })
      expect(mockAnchor.href).toBe(urlWithParams)
    })

    it('应该处理 HTTPS URL', async () => {
      const httpsUrl = 'https://secure.example.com/file.pdf'
      await download({ url: httpsUrl, fileName: 'secure.pdf' })
      expect(mockAnchor.href).toBe(httpsUrl)
    })
  })

  describe('文件名处理', () => {
    it('应该处理包含空格的文件名', async () => {
      await download({
        url: 'http://example.com/file.pdf',
        fileName: 'my document.pdf',
      })
      expect(mockAnchor.download).toBe('my document.pdf')
    })

    it('应该处理中文文件名', async () => {
      await download({
        url: 'http://example.com/file.pdf',
        fileName: '文档.pdf',
      })
      expect(mockAnchor.download).toBe('文档.pdf')
    })

    it('应该处理特殊字符文件名', async () => {
      await download({
        url: 'http://example.com/file.pdf',
        fileName: 'file_v2.0-final(1).pdf',
      })
      expect(mockAnchor.download).toBe('file_v2.0-final(1).pdf')
    })

    it('应该处理长文件名', async () => {
      const longFileName = 'a'.repeat(200) + '.pdf'
      await download({
        url: 'http://example.com/file.pdf',
        fileName: longFileName,
      })
      expect(mockAnchor.download).toBe(longFileName)
    })
  })

  describe('执行顺序', () => {
    it('应该按正确的顺序执行操作', async () => {
      const callOrder: string[] = []

      createElementSpy.mockImplementation(() => {
        callOrder.push('createElement')
        return mockAnchor as HTMLAnchorElement
      })

      appendChildSpy.mockImplementation(() => {
        callOrder.push('appendChild')
        return mockAnchor as Node
      })
      ;(mockAnchor.click as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callOrder.push('click')
      })

      revokeObjectURLSpy.mockImplementation(() => {
        callOrder.push('revokeObjectURL')
      })

      removeChildSpy.mockImplementation(() => {
        callOrder.push('removeChild')
        return mockAnchor as Node
      })

      await download({
        url: 'http://example.com/file.pdf',
        fileName: 'test.pdf',
      })

      expect(callOrder).toEqual([
        'createElement',
        'appendChild',
        'click',
        'revokeObjectURL',
        'removeChild',
      ])
    })
  })
})
