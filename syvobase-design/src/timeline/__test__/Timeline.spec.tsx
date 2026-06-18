import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Timeline } from '../Timeline'

describe('Timeline 时间线组件', () => {
  const defaultItems = [
    { id: '1', name: '事件1', content: <div>内容1</div> },
    { id: '2', name: '事件2', content: <div>内容2</div> },
    { id: '3', name: '事件3' },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染所有事件', () => {
      render(<Timeline items={defaultItems} />)
      expect(screen.getByText('事件1')).toBeInTheDocument()
      expect(screen.getByText('事件2')).toBeInTheDocument()
      expect(screen.getByText('事件3')).toBeInTheDocument()
    })

    it('应该渲染事件内容', () => {
      render(<Timeline items={defaultItems} />)
      expect(screen.getByText('内容1')).toBeInTheDocument()
      expect(screen.getByText('内容2')).toBeInTheDocument()
    })
  })

  describe('节点样式', () => {
    it('默认应该显示实心点', () => {
      const { container } = render(<Timeline items={defaultItems} />)
      const dots = container.querySelectorAll('.bg-primary')
      expect(dots.length).toBeGreaterThan(0)
    })

    it('dot 为 false 时应该显示空心点', () => {
      const items = [{ id: '1', name: '事件1', dot: false }]
      const { container } = render(<Timeline items={items} />)
      const emptyDot = container.querySelector('.border-2')
      expect(emptyDot).toBeInTheDocument()
    })
  })

  describe('图标节点 (icon)', () => {
    it('有 icon 时应该显示图标', () => {
      const items = [{ id: '1', name: '事件1', icon: 'Star' }]
      const { container } = render(<Timeline items={items} />)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('自定义颜色 (color)', () => {
    it('应该支持自定义节点颜色', () => {
      const items = [{ id: '1', name: '事件1', color: 'red' }]
      const { container } = render(<Timeline items={items} />)
      const dot = container.querySelector('.bg-primary, [style*="background"]')
      expect(dot).toBeInTheDocument()
    })
  })

  describe('连接线', () => {
    it('非最后一项应该有连接线', () => {
      const { container } = render(<Timeline items={defaultItems} />)
      const lines = container.querySelectorAll('.min-h-16')
      // 有 3 个事件，前 2 个应该有连接线
      expect(lines.length).toBe(2)
    })

    it('最后一项不应该有连接线', () => {
      const items = [{ id: '1', name: '唯一事件' }]
      const { container } = render(<Timeline items={items} />)
      const lines = container.querySelectorAll('.min-h-16')
      expect(lines.length).toBe(0)
    })
  })

  describe('空数据', () => {
    it('items 为空时应该正确渲染', () => {
      const { container } = render(<Timeline items={[]} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带图标和自定义颜色的时间线应该正确渲染', () => {
      const items = [
        { id: '1', name: '开始', icon: 'Play', color: 'green' },
        { id: '2', name: '进行中', color: 'blue', content: <div>详情</div> },
        { id: '3', name: '结束', icon: 'CheckCircle', color: 'gray' },
      ]
      render(<Timeline items={items} />)
      expect(screen.getByText('开始')).toBeInTheDocument()
      expect(screen.getByText('进行中')).toBeInTheDocument()
      expect(screen.getByText('结束')).toBeInTheDocument()
      expect(screen.getByText('详情')).toBeInTheDocument()
    })

    it('单个事件带内容应该正确渲染', () => {
      const items = [
        { id: '1', name: '唯一事件', content: <div>唯一内容</div> },
      ]
      render(<Timeline items={items} />)
      expect(screen.getByText('唯一事件')).toBeInTheDocument()
      expect(screen.getByText('唯一内容')).toBeInTheDocument()
    })
  })
})
