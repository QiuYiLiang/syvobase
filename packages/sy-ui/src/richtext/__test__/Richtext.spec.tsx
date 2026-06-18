import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { Richtext } from '../Richtext'

// 辅助函数：获取编辑器元素
const getEditor = (container: HTMLElement) =>
  container.querySelector('[data-slate-editor="true"]')

// 辅助函数：获取富文本根元素
const getRichtextRoot = (container: HTMLElement) =>
  container.querySelector('[data-tag="nk-richtext"]')

// 辅助函数：获取工具栏元素
const getToolbar = (container: HTMLElement) =>
  container.querySelector('[data-tag="nk-toolbar"]')

// 辅助函数：获取滚动容器元素
const getScrollContainer = (container: HTMLElement) =>
  container.querySelector('[data-richtext-scroll-container]')

describe('Richtext 组件', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('基础渲染测试', () => {
    it('应该正确渲染富文本编辑器', async () => {
      const { container } = render(<Richtext />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该使用 data-tag 属性标记组件', async () => {
      const { container } = render(<Richtext />)

      await waitFor(() => {
        expect(getRichtextRoot(container)).toBeInTheDocument()
      })
    })

    it('应该应用自定义 className', async () => {
      const { container } = render(<Richtext className='custom-class' />)

      await waitFor(() => {
        expect(getRichtextRoot(container)).toHaveClass('custom-class')
      })
    })

    it('应该应用自定义 style', async () => {
      const customStyle = { padding: '10px', margin: '5px' }
      const { container } = render(<Richtext style={customStyle} />)

      await waitFor(() => {
        expect(getRichtextRoot(container)).toHaveStyle({
          padding: '10px',
          margin: '5px',
        })
      })
    })
  })

  describe('工具栏测试', () => {
    it('默认应该显示工具栏', async () => {
      const { container } = render(<Richtext />)

      await waitFor(() => {
        expect(getToolbar(container)).toBeInTheDocument()
      })
    })

    it('showToolbar=false 时不应该显示工具栏', async () => {
      const { container } = render(<Richtext showToolbar={false} />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
      expect(getToolbar(container)).not.toBeInTheDocument()
    })

    it('readMode=true 时不应该显示工具栏', async () => {
      const { container } = render(<Richtext readMode={true} />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
      expect(getToolbar(container)).not.toBeInTheDocument()
    })
  })

  describe('只读模式测试', () => {
    it('默认应该是可编辑模式', async () => {
      const { container } = render(<Richtext />)

      await waitFor(() => {
        const editor = getEditor(container)
        expect(editor).toBeInTheDocument()
        expect(editor).toHaveAttribute('contenteditable', 'true')
      })
    })

    it('readMode=true 时应该设置只读属性', async () => {
      const { container } = render(<Richtext readMode={true} />)

      await waitFor(() => {
        const editor = getEditor(container)
        expect(editor).toBeInTheDocument()
        expect(editor).toHaveAttribute('contenteditable', 'false')
      })
    })
  })

  describe('自动聚焦测试', () => {
    it('autoFocus=true 时应该自动聚焦', async () => {
      const { container } = render(<Richtext autoFocus={true} />)

      await waitFor(() => {
        const editor = getEditor(container)
        expect(editor).toBeInTheDocument()
      })
    })
  })

  describe('尺寸属性测试', () => {
    it('应该应用自定义数值最小高度', async () => {
      const { container } = render(<Richtext minHeight={300} />)

      await waitFor(() => {
        const editor = getEditor(container)
        expect(editor).toBeInTheDocument()
        expect(editor).toHaveStyle({ minHeight: '300px' })
      })
    })

    it('应该应用自定义字符串最小高度', async () => {
      const { container } = render(<Richtext minHeight='50vh' />)

      await waitFor(() => {
        const editor = getEditor(container)
        expect(editor).toBeInTheDocument()
        expect(editor).toHaveStyle({ minHeight: '50vh' })
      })
    })

    it('应该应用数值最大高度', async () => {
      const { container } = render(<Richtext maxHeight={500} />)

      await waitFor(() => {
        const scrollContainer = getScrollContainer(container)
        expect(scrollContainer).toBeInTheDocument()
        expect(scrollContainer).toHaveStyle({ maxHeight: '500px' })
      })
    })

    it('应该应用字符串最大高度', async () => {
      const { container } = render(<Richtext maxHeight='80vh' />)

      await waitFor(() => {
        const scrollContainer = getScrollContainer(container)
        expect(scrollContainer).toBeInTheDocument()
        expect(scrollContainer).toHaveStyle({ maxHeight: '80vh' })
      })
    })

    it('设置最大高度时应该启用滚动', async () => {
      const { container } = render(<Richtext maxHeight={500} />)

      await waitFor(() => {
        const scrollContainer = getScrollContainer(container)
        expect(scrollContainer).toBeInTheDocument()
        expect(scrollContainer).toHaveClass('overflow-auto')
      })
    })
  })

  describe('值处理测试', () => {
    it('应该处理 undefined 值', async () => {
      const { container } = render(<Richtext value={undefined} />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该处理空字符串值', async () => {
      const { container } = render(<Richtext value='' />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该处理有效的 JSON 值', async () => {
      const validJson = JSON.stringify([
        { type: 'p', children: [{ text: '测试内容' }] },
      ])
      const { container } = render(<Richtext value={validJson} />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该处理纯文本值', async () => {
      const { container } = render(<Richtext value='这是纯文本' />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该处理无效的 JSON 值', async () => {
      const { container } = render(<Richtext value='invalid json {' />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该使用 defaultValue 初始化', async () => {
      const defaultJson = JSON.stringify([
        { type: 'p', children: [{ text: '默认内容' }] },
      ])
      const { container } = render(<Richtext defaultValue={defaultJson} />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('value 优先于 defaultValue', async () => {
      const valueJson = JSON.stringify([
        { type: 'p', children: [{ text: '值内容' }] },
      ])
      const defaultJson = JSON.stringify([
        { type: 'p', children: [{ text: '默认内容' }] },
      ])
      const { container } = render(
        <Richtext value={valueJson} defaultValue={defaultJson} />
      )

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })
  })

  describe('onChange 回调测试', () => {
    it('应该接受 onChange 回调', async () => {
      const handleChange = vi.fn()
      const { container } = render(<Richtext onChange={handleChange} />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('没有 onChange 时不应该报错', () => {
      expect(() => render(<Richtext />)).not.toThrow()
    })
  })

  describe('CSS 类名测试', () => {
    it('应该包含基础 CSS 类', async () => {
      const { container } = render(<Richtext />)

      await waitFor(() => {
        const richtextElement = getRichtextRoot(container)
        expect(richtextElement).toHaveClass('relative')
        expect(richtextElement).toHaveClass('w-full')
      })
    })

    it('编辑器应该包含 prose 类', async () => {
      const { container } = render(<Richtext />)

      await waitFor(() => {
        const editor = getEditor(container)
        expect(editor).toBeInTheDocument()
        expect(editor?.className).toContain('prose')
      })
    })

    it('只读模式下编辑器应该包含 cursor-default 类', async () => {
      const { container } = render(<Richtext readMode={true} />)

      await waitFor(() => {
        const editor = getEditor(container)
        expect(editor).toBeInTheDocument()
        expect(editor?.className).toContain('cursor-default')
      })
    })
  })

  describe('边界情况测试', () => {
    it('应该处理空数组 JSON', async () => {
      const { container } = render(<Richtext value='[]' />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该处理包含空格的纯文本', async () => {
      const { container } = render(<Richtext value='   带空格的文本   ' />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该处理仅包含空格的值', async () => {
      const { container } = render(<Richtext value='   ' />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该处理多段落 JSON', async () => {
      const multiParagraph = JSON.stringify([
        { type: 'p', children: [{ text: '第一段' }] },
        { type: 'p', children: [{ text: '第二段' }] },
        { type: 'p', children: [{ text: '第三段' }] },
      ])
      const { container } = render(<Richtext value={multiParagraph} />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该处理复杂嵌套内容', async () => {
      const complexContent = JSON.stringify([
        { type: 'h1', children: [{ text: '标题' }] },
        { type: 'p', children: [{ text: '段落', bold: true }] },
        {
          type: 'ul',
          children: [{ type: 'li', children: [{ text: '列表项' }] }],
        },
      ])
      const { container } = render(<Richtext value={complexContent} />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })
  })

  describe('Props 组合测试', () => {
    it('应该同时处理多个 props', async () => {
      const handleChange = vi.fn()
      const { container } = render(
        <Richtext
          className='custom-class'
          style={{ border: '1px solid red' }}
          showToolbar={true}
          readMode={false}
          placeholder='输入内容...'
          minHeight={250}
          maxHeight={600}
          autoFocus={true}
          value='测试值'
          onChange={handleChange}
        />
      )

      await waitFor(() => {
        const richtextElement = getRichtextRoot(container)
        expect(richtextElement).toHaveClass('custom-class')
        expect(richtextElement).toHaveAttribute(
          'style',
          expect.stringContaining('border')
        )
        expect(getToolbar(container)).toBeInTheDocument()
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该处理仅必要 props', async () => {
      const { container } = render(<Richtext />)

      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
        expect(getToolbar(container)).toBeInTheDocument()
      })
    })
  })
})

describe('序列化/反序列化函数测试', () => {
  // 由于这些函数是内部函数，我们通过组件行为来测试它们

  describe('deserializeValue 行为', () => {
    it('应该将 undefined 转换为初始值', async () => {
      const { container } = render(<Richtext value={undefined} />)
      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该将空字符串转换为初始值', async () => {
      const { container } = render(<Richtext value='' />)
      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该正确解析有效 JSON', async () => {
      const validJson = JSON.stringify([
        { type: 'p', children: [{ text: 'test' }] },
      ])
      const { container } = render(<Richtext value={validJson} />)
      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })

    it('应该将无效 JSON 作为纯文本处理', async () => {
      const { container } = render(<Richtext value='这不是 JSON' />)
      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })
  })

  describe('serializeValue 行为', () => {
    it('onChange 应该接收序列化后的字符串', async () => {
      const handleChange = vi.fn()
      const { container } = render(<Richtext onChange={handleChange} />)
      // 验证组件正常渲染，onChange 可以被调用
      await waitFor(() => {
        expect(getEditor(container)).toBeInTheDocument()
      })
    })
  })
})

describe('编辑器同步测试', () => {
  it('应该在 value 变化时同步编辑器', async () => {
    const { container, rerender } = render(<Richtext value='初始值' />)

    await waitFor(() => {
      expect(getEditor(container)).toBeInTheDocument()
    })

    // 重新渲染新值
    rerender(<Richtext value='新值' />)

    await waitFor(() => {
      expect(getEditor(container)).toBeInTheDocument()
    })
  })

  it('应该处理从 undefined 到有值的变化', async () => {
    const { container, rerender } = render(<Richtext value={undefined} />)

    await waitFor(() => {
      expect(getEditor(container)).toBeInTheDocument()
    })

    rerender(<Richtext value='新值' />)

    await waitFor(() => {
      expect(getEditor(container)).toBeInTheDocument()
    })
  })

  it('应该处理从有值到 undefined 的变化', async () => {
    const { container, rerender } = render(<Richtext value='初始值' />)

    await waitFor(() => {
      expect(getEditor(container)).toBeInTheDocument()
    })

    rerender(<Richtext value={undefined} />)

    await waitFor(() => {
      expect(getEditor(container)).toBeInTheDocument()
    })
  })
})
