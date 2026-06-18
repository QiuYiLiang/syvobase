import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getFileType, getFileIcon, fileToBase64, fileToText } from '../file'

describe('file 文件工具函数', () => {
  describe('getFileType 获取文件类型', () => {
    describe('图片类型', () => {
      it('应该识别 jpg 文件', () => {
        expect(getFileType('photo.jpg')).toBe('image')
      })

      it('应该识别 jpeg 文件', () => {
        expect(getFileType('photo.jpeg')).toBe('image')
      })

      it('应该识别 png 文件', () => {
        expect(getFileType('image.png')).toBe('image')
      })

      it('应该识别 gif 文件', () => {
        expect(getFileType('animation.gif')).toBe('image')
      })

      it('应该识别 bmp 文件', () => {
        expect(getFileType('bitmap.bmp')).toBe('image')
      })

      it('应该识别 tif 文件', () => {
        expect(getFileType('scan.tif')).toBe('image')
      })
    })

    describe('视频类型', () => {
      it('应该识别 mp4 文件', () => {
        expect(getFileType('video.mp4')).toBe('video')
      })

      it('应该识别 avi 文件', () => {
        expect(getFileType('video.avi')).toBe('video')
      })

      it('应该识别 mov 文件', () => {
        expect(getFileType('video.mov')).toBe('video')
      })

      it('应该识别 mpeg 文件', () => {
        expect(getFileType('video.mpeg')).toBe('video')
      })

      it('应该识别 mpg 文件', () => {
        expect(getFileType('video.mpg')).toBe('video')
      })
    })

    describe('音频类型', () => {
      it('应该识别 mp3 文件', () => {
        expect(getFileType('music.mp3')).toBe('audio')
      })

      it('应该识别 wav 文件', () => {
        expect(getFileType('sound.wav')).toBe('audio')
      })

      it('应该识别 ram 文件', () => {
        expect(getFileType('audio.ram')).toBe('audio')
      })
    })

    describe('Word 文档类型', () => {
      it('应该识别 doc 文件', () => {
        expect(getFileType('document.doc')).toBe('word')
      })

      it('应该识别 docx 文件', () => {
        expect(getFileType('document.docx')).toBe('word')
      })
    })

    describe('Excel 文档类型', () => {
      it('应该识别 xls 文件', () => {
        expect(getFileType('spreadsheet.xls')).toBe('excel')
      })

      it('应该识别 xlsx 文件', () => {
        expect(getFileType('spreadsheet.xlsx')).toBe('excel')
      })
    })

    describe('PPT 文档类型', () => {
      it('应该识别 ppt 文件', () => {
        expect(getFileType('presentation.ppt')).toBe('ppt')
      })

      it('应该识别 pptx 文件', () => {
        expect(getFileType('presentation.pptx')).toBe('ppt')
      })
    })

    describe('PDF 文档类型', () => {
      it('应该识别 pdf 文件', () => {
        expect(getFileType('document.pdf')).toBe('pdf')
      })
    })

    describe('未知文件类型', () => {
      it('应该返回 file 对于 txt 文件', () => {
        expect(getFileType('readme.txt')).toBe('file')
      })

      it('应该返回 file 对于 json 文件', () => {
        expect(getFileType('config.json')).toBe('file')
      })

      it('应该返回 file 对于 js 文件', () => {
        expect(getFileType('script.js')).toBe('file')
      })

      it('应该返回 file 对于 html 文件', () => {
        expect(getFileType('index.html')).toBe('file')
      })

      it('应该返回 file 对于 css 文件', () => {
        expect(getFileType('style.css')).toBe('file')
      })

      it('应该返回 file 对于 zip 文件', () => {
        expect(getFileType('archive.zip')).toBe('file')
      })

      it('应该返回 file 对于无扩展名文件', () => {
        expect(getFileType('Makefile')).toBe('file')
      })
    })

    describe('边界情况', () => {
      it('应该处理多个点的文件名', () => {
        expect(getFileType('file.backup.jpg')).toBe('image')
      })

      it('应该处理大写扩展名', () => {
        // 当前实现是大小写敏感的，这里测试实际行为
        expect(getFileType('photo.JPG')).toBe('file')
      })

      it('应该处理带路径的文件名', () => {
        expect(getFileType('/path/to/photo.jpg')).toBe('image')
      })

      it('应该处理空字符串', () => {
        expect(getFileType('')).toBe('file')
      })

      it('应该处理只有点的文件名', () => {
        expect(getFileType('.')).toBe('file')
      })

      it('应该处理以点开头的隐藏文件', () => {
        expect(getFileType('.gitignore')).toBe('file')
      })
    })
  })

  describe('getFileIcon 获取文件图标', () => {
    describe('图片类型图标', () => {
      it('应该返回 Image 图标对于图片文件', () => {
        expect(getFileIcon('photo.jpg')).toBe('Image')
        expect(getFileIcon('photo.png')).toBe('Image')
        expect(getFileIcon('photo.gif')).toBe('Image')
      })
    })

    describe('视频类型图标', () => {
      it('应该返回 Film 图标对于视频文件', () => {
        expect(getFileIcon('video.mp4')).toBe('Film')
        expect(getFileIcon('video.avi')).toBe('Film')
        expect(getFileIcon('video.mov')).toBe('Film')
      })
    })

    describe('音频类型图标', () => {
      it('应该返回 AudioLines 图标对于音频文件', () => {
        expect(getFileIcon('music.mp3')).toBe('AudioLines')
        expect(getFileIcon('sound.wav')).toBe('AudioLines')
      })
    })

    describe('Office 文档图标', () => {
      it('应该返回 icon-word 图标对于 Word 文件', () => {
        expect(getFileIcon('document.doc')).toBe('icon-word')
        expect(getFileIcon('document.docx')).toBe('icon-word')
      })

      it('应该返回 icon-excel 图标对于 Excel 文件', () => {
        expect(getFileIcon('spreadsheet.xls')).toBe('icon-excel')
        expect(getFileIcon('spreadsheet.xlsx')).toBe('icon-excel')
      })

      it('应该返回 icon-ppt 图标对于 PPT 文件', () => {
        expect(getFileIcon('presentation.ppt')).toBe('icon-ppt')
        expect(getFileIcon('presentation.pptx')).toBe('icon-ppt')
      })

      it('应该返回 icon-pdf 图标对于 PDF 文件', () => {
        expect(getFileIcon('document.pdf')).toBe('icon-pdf')
      })
    })

    describe('通用文件图标', () => {
      it('应该返回 File 图标对于未知类型', () => {
        expect(getFileIcon('readme.txt')).toBe('File')
        expect(getFileIcon('config.json')).toBe('File')
        expect(getFileIcon('script.js')).toBe('File')
      })
    })
  })

  describe('fileToBase64 文件转 Base64', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('应该将文件转换为 base64 字符串', async () => {
      const fileContent = 'Hello, World!'
      const file = new File([fileContent], 'test.txt', { type: 'text/plain' })

      const result = await fileToBase64(file)

      expect(result).toContain('data:text/plain;base64,')
    })

    it('应该处理图片文件', async () => {
      // 创建一个简单的 1x1 像素 PNG 图片数据
      const pngData = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0,
        1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65,
        84, 120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73,
        69, 78, 68, 174, 66, 96, 130,
      ])
      const file = new File([pngData], 'test.png', { type: 'image/png' })

      const result = await fileToBase64(file)

      expect(result).toContain('data:image/png;base64,')
    })

    it('应该处理空文件', async () => {
      const file = new File([], 'empty.txt', { type: 'text/plain' })

      const result = await fileToBase64(file)

      expect(result).toContain('data:text/plain;base64,')
    })

    it('应该返回空字符串当没有文件时', async () => {
      const result = await fileToBase64(null as any)

      expect(result).toBe('')
    })

    it('应该返回空字符串当文件为 undefined 时', async () => {
      const result = await fileToBase64(undefined as any)

      expect(result).toBe('')
    })

    it('应该处理大文件', async () => {
      const largeContent = 'x'.repeat(1024 * 1024) // 1MB
      const file = new File([largeContent], 'large.txt', { type: 'text/plain' })

      const result = await fileToBase64(file)

      expect(result).toContain('data:text/plain;base64,')
      expect(typeof result).toBe('string')
    })

    it('应该处理二进制文件', async () => {
      const binaryData = new Uint8Array([0, 1, 2, 3, 255, 254, 253, 252])
      const file = new File([binaryData], 'binary.bin', {
        type: 'application/octet-stream',
      })

      const result = await fileToBase64(file)

      expect(result).toContain('data:application/octet-stream;base64,')
    })
  })

  describe('fileToText 文件转文本', () => {
    it('应该将文件转换为文本字符串', async () => {
      const content = 'Hello, World!'
      const file = new File([content], 'test.txt', { type: 'text/plain' })

      const result = await fileToText(file)

      expect(result).toBe(content)
    })

    it('应该处理中文内容', async () => {
      const content = '你好，世界！'
      const file = new File([content], 'chinese.txt', { type: 'text/plain' })

      const result = await fileToText(file)

      expect(result).toBe(content)
    })

    it('应该处理 JSON 文件', async () => {
      const jsonContent = JSON.stringify({ name: 'test', value: 123 })
      const file = new File([jsonContent], 'data.json', {
        type: 'application/json',
      })

      const result = await fileToText(file)

      expect(result).toBe(jsonContent)
      expect(JSON.parse(result as string)).toEqual({ name: 'test', value: 123 })
    })

    it('应该处理 HTML 文件', async () => {
      const htmlContent = '<html><body><h1>Hello</h1></body></html>'
      const file = new File([htmlContent], 'page.html', { type: 'text/html' })

      const result = await fileToText(file)

      expect(result).toBe(htmlContent)
    })

    it('应该处理 CSS 文件', async () => {
      const cssContent = 'body { color: red; }'
      const file = new File([cssContent], 'style.css', { type: 'text/css' })

      const result = await fileToText(file)

      expect(result).toBe(cssContent)
    })

    it('应该处理空文件', async () => {
      const file = new File([], 'empty.txt', { type: 'text/plain' })

      const result = await fileToText(file)

      expect(result).toBe('')
    })

    it('应该返回空字符串当没有文件时', async () => {
      const result = await fileToText(null as any)

      expect(result).toBe('')
    })

    it('应该返回空字符串当文件为 undefined 时', async () => {
      const result = await fileToText(undefined as any)

      expect(result).toBe('')
    })

    it('应该处理多行文本', async () => {
      const content = 'Line 1\nLine 2\nLine 3'
      const file = new File([content], 'multiline.txt', { type: 'text/plain' })

      const result = await fileToText(file)

      expect(result).toBe(content)
    })

    it('应该处理特殊字符', async () => {
      const content = 'Special chars: <>&"\'\\t\\n'
      const file = new File([content], 'special.txt', { type: 'text/plain' })

      const result = await fileToText(file)

      expect(result).toBe(content)
    })

    it('应该处理 Unicode 字符', async () => {
      const content = '🎉 Emoji test 👍 日本語 한국어'
      const file = new File([content], 'unicode.txt', { type: 'text/plain' })

      const result = await fileToText(file)

      expect(result).toBe(content)
    })
  })
})
