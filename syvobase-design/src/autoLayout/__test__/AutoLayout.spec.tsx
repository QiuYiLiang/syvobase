import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { AutoLayout } from '../AutoLayout'
import { AutoLayoutEditorProvider } from '../AutoLayoutProvider'

const mockOnItemRender = vi.fn(({ item }) => (
  <div data-testid={`item-${item.id}`}>{item.id}</div>
))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AutoLayoutEditorProvider>{children}</AutoLayoutEditorProvider>
)

describe('AutoLayout 自动布局组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(
        <Wrapper>
          <AutoLayout value={[]} onItemRender={mockOnItemRender} />
        </Wrapper>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('渲染类型 (renderType)', () => {
    it('renderType 为 pc 时应该渲染 PC 布局', () => {
      const { container } = render(
        <Wrapper>
          <AutoLayout
            value={[]}
            renderType='pc'
            readMode
            onItemRender={mockOnItemRender}
          />
        </Wrapper>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renderType 为 mobile 时应该渲染移动端布局', () => {
      const { container } = render(
        <Wrapper>
          <AutoLayout
            value={[]}
            renderType='mobile'
            readMode
            onItemRender={mockOnItemRender}
          />
        </Wrapper>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('readMode 为 false 时应该渲染编辑器', () => {
      const { container } = render(
        <Wrapper>
          <AutoLayout
            value={[]}
            readMode={false}
            onItemRender={mockOnItemRender}
          />
        </Wrapper>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('readMode 为 true 时应该渲染预览视图', () => {
      const { container } = render(
        <Wrapper>
          <AutoLayout value={[]} readMode onItemRender={mockOnItemRender} />
        </Wrapper>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('值 (value)', () => {
    it('应该支持传入布局数据', () => {
      const value = [{ id: '1', x: 0, y: 0, w: 50, h: 100 }]
      const { container } = render(
        <Wrapper>
          <AutoLayout value={value} readMode onItemRender={mockOnItemRender} />
        </Wrapper>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
