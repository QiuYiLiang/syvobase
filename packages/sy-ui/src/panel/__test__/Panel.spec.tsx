import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Panel } from '../Panel'

describe('Panel 面板组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染 children', () => {
      render(<Panel>面板内容</Panel>)
      expect(screen.getByText('面板内容')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Panel className='custom-class'>内容</Panel>)
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('类型 (type)', () => {
    it('默认类型应该是 default', () => {
      const { container } = render(<Panel>内容</Panel>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('card 类型应该有卡片样式', () => {
      const { container } = render(<Panel type='card'>内容</Panel>)
      expect(container.firstChild).toHaveClass('rounded-lg')
      expect(container.firstChild).toHaveClass('border')
    })
  })

  describe('头部 (header)', () => {
    it('应该渲染 header', () => {
      render(<Panel header='面板标题'>内容</Panel>)
      expect(screen.getByText('面板标题')).toBeInTheDocument()
    })

    it('header 可以是 ReactNode', () => {
      render(<Panel header={<h2>自定义标题</h2>}>内容</Panel>)
      expect(screen.getByText('自定义标题')).toBeInTheDocument()
    })
  })

  describe('底部 (footer)', () => {
    it('应该渲染 footer', () => {
      render(<Panel footer='面板底部'>内容</Panel>)
      expect(screen.getByText('面板底部')).toBeInTheDocument()
    })
  })

  describe('工具栏 (topToolbar/toolbar)', () => {
    it('应该渲染顶部工具栏', () => {
      render(<Panel topToolbar={[{ name: '工具按钮' }]}>内容</Panel>)
      expect(screen.getByText('工具按钮')).toBeInTheDocument()
    })

    it('应该渲染底部工具栏', () => {
      render(<Panel toolbar={[{ name: '底部按钮' }]}>内容</Panel>)
      expect(screen.getByText('底部按钮')).toBeInTheDocument()
    })
  })

  describe('宽度 (width)', () => {
    it('默认宽度应该是 100%', () => {
      const { container } = render(<Panel>内容</Panel>)
      const contentWrapper = container.querySelector('[style*="width"]')
      expect(contentWrapper).toHaveStyle({ width: '100%' })
    })

    it('应该支持自定义宽度', () => {
      const { container } = render(<Panel width={600}>内容</Panel>)
      const contentWrapper = container.querySelector('[style*="width: 600px"]')
      expect(contentWrapper).toBeInTheDocument()
    })
  })

  describe('内边距 (padding)', () => {
    it('应该支持自定义 padding', () => {
      const { container } = render(<Panel padding={20}>内容</Panel>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持自定义 paddingX', () => {
      const { container } = render(<Panel paddingX={30}>内容</Panel>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持自定义 paddingY', () => {
      const { container } = render(<Panel paddingY={15}>内容</Panel>)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('禁用内容内边距 (disabledContentPadding)', () => {
    it('disabledContentPadding 为 true 时内容区域不应该有内边距', () => {
      const { container } = render(<Panel disabledContentPadding>内容</Panel>)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('边框 (border)', () => {
    it('border 为 true 时顶部区域应该有边框', () => {
      const { container } = render(
        <Panel header='标题' border>
          内容
        </Panel>
      )
      expect(container.querySelector('.border-b')).toBeInTheDocument()
    })
  })

  describe('固定布局 (fixed)', () => {
    it('默认应该是固定布局', () => {
      const { container } = render(<Panel>内容</Panel>)
      expect(container.firstChild).toHaveClass('h-full')
      expect(container.firstChild).toHaveClass('flex-col')
    })

    it('fixed 为 false 时不应该是固定布局', () => {
      const { container } = render(<Panel fixed={false}>内容</Panel>)
      expect(container.firstChild).not.toHaveClass('h-full')
    })
  })

  describe('组合场景', () => {
    it('带标题和工具栏的卡片面板应该正确渲染', () => {
      render(
        <Panel
          type='card'
          header='卡片标题'
          topToolbar={[{ name: '编辑' }]}
          toolbar={[{ name: '确定' }, { name: '取消' }]}
        >
          卡片内容
        </Panel>
      )
      expect(screen.getByText('卡片标题')).toBeInTheDocument()
      expect(screen.getByText('卡片内容')).toBeInTheDocument()
      expect(screen.getByText('编辑')).toBeInTheDocument()
      expect(screen.getByText('确定')).toBeInTheDocument()
      expect(screen.getByText('取消')).toBeInTheDocument()
    })

    it('带边框和固定宽度的面板应该正确渲染', () => {
      const { container } = render(
        <Panel header='标题' border width={400}>
          内容
        </Panel>
      )
      expect(container.querySelector('.border-b')).toBeInTheDocument()
      expect(
        container.querySelector('[style*="width: 400px"]')
      ).toBeInTheDocument()
    })
  })
})
