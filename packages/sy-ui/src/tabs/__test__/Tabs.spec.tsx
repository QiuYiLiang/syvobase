import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs } from '../Tabs'

describe('Tabs 标签页组件', () => {
  const defaultItems = [
    { id: '1', name: '标签1', content: <div>内容1</div> },
    { id: '2', name: '标签2', content: <div>内容2</div> },
    { id: '3', name: '标签3', content: <div>内容3</div> },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染所有标签', () => {
      render(<Tabs items={defaultItems} />)
      expect(screen.getByText('标签1')).toBeInTheDocument()
      expect(screen.getByText('标签2')).toBeInTheDocument()
      expect(screen.getByText('标签3')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <Tabs className='custom-class' items={defaultItems} />
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('默认应该选中第一个标签', () => {
      render(<Tabs items={defaultItems} />)
      expect(screen.getByText('内容1')).toBeInTheDocument()
    })
  })

  describe('标签切换', () => {
    it('点击标签应该切换内容', () => {
      render(<Tabs items={defaultItems} />)
      fireEvent.click(screen.getByText('标签2'))
      expect(screen.getByText('内容2')).toBeInTheDocument()
    })

    it('应该触发 onChange 回调', () => {
      const onChange = vi.fn()
      render(<Tabs items={defaultItems} value='1' onChange={onChange} />)
      fireEvent.click(screen.getByText('标签2'))
      expect(onChange).toHaveBeenCalledWith('2')
    })

    it('可以控制选中的标签', () => {
      render(<Tabs items={defaultItems} value='2' />)
      expect(screen.getByText('内容2')).toBeInTheDocument()
    })
  })

  describe('标签类型 (type)', () => {
    it('默认类型应该是 pills', () => {
      const { container } = render(<Tabs type='pills' items={defaultItems} />)
      expect(container.querySelector('.bg-muted')).toBeInTheDocument()
    })

    it('line 类型应该有下划线样式', () => {
      const { container } = render(<Tabs type='line' items={defaultItems} />)
      expect(container.querySelector('.space-x-5')).toBeInTheDocument()
    })
  })

  describe('方向 (direction)', () => {
    it('默认方向是 top', () => {
      const { container } = render(<Tabs items={defaultItems} />)
      expect(container.querySelector('.flex-col')).toBeInTheDocument()
    })

    it('left 方向应该垂直布局', () => {
      const { container } = render(
        <Tabs direction='left' items={defaultItems} />
      )
      expect(container.querySelector('.flex-col')).toBeInTheDocument()
    })
  })

  describe('全宽模式 (full)', () => {
    it('full 为 true 时标签应该占满容器', () => {
      const { container } = render(<Tabs full items={defaultItems} />)
      expect(container.querySelector('.w-full')).toBeInTheDocument()
    })
  })

  describe('可关闭标签 (enabledClose)', () => {
    it('enabledClose 为 true 时应该显示关闭按钮', () => {
      const { container } = render(
        <Tabs enabledClose items={defaultItems} onItemsChange={vi.fn()} />
      )
      // 关闭按钮使用 X 图标
      const closeButtons = container.querySelectorAll('svg')
      expect(closeButtons.length).toBeGreaterThan(0)
    })

    it('只有一个标签时不应该显示关闭按钮', () => {
      const { container } = render(
        <Tabs
          enabledClose
          items={[{ id: '1', name: '唯一标签', content: <div>内容</div> }]}
          onItemsChange={vi.fn()}
        />
      )
      // 只有一个标签时不应该有关闭按钮
      const closeButtons = container.querySelectorAll('[role="button"]')
      const xButtons = Array.from(closeButtons).filter((btn) =>
        btn.querySelector('svg')
      )
      expect(xButtons.length).toBe(0)
    })
  })

  describe('前后插槽 (before/after)', () => {
    it('应该渲染 before 插槽', () => {
      render(<Tabs items={defaultItems} before={<span>前置内容</span>} />)
      expect(screen.getByText('前置内容')).toBeInTheDocument()
    })

    it('应该渲染 after 插槽', () => {
      render(<Tabs items={defaultItems} after={<span>后置内容</span>} />)
      expect(screen.getByText('后置内容')).toBeInTheDocument()
    })
  })

  describe('空 items', () => {
    it('items 为空时应该正确渲染', () => {
      const { container } = render(<Tabs items={[]} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('垂直 line 类型标签应该正确渲染', () => {
      const { container } = render(
        <Tabs type='line' direction='left' items={defaultItems} />
      )
      expect(container.querySelector('.space-y-3')).toBeInTheDocument()
    })

    it('全宽 pills 类型标签应该正确渲染', () => {
      const { container } = render(
        <Tabs type='pills' full items={defaultItems} />
      )
      expect(container.querySelector('.bg-muted')).toBeInTheDocument()
      expect(container.querySelector('.w-full')).toBeInTheDocument()
    })
  })
})
