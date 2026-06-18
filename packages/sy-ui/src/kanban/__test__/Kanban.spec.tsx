import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Kanban } from '../Kanban'

describe('Kanban 看板组件', () => {
  const defaultItems = [
    { id: 'todo', name: '待办', color: '#e74c3c' },
    { id: 'doing', name: '进行中', color: '#f39c12' },
    { id: 'done', name: '已完成', color: '#27ae60' },
  ]

  const defaultValue = [
    { id: '1', name: '任务1', group: 'todo' },
    { id: '2', name: '任务2', group: 'doing' },
    { id: '3', name: '任务3', group: 'done' },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染所有列', () => {
      render(<Kanban items={defaultItems} value={defaultValue} />)
      expect(screen.getByText('待办')).toBeInTheDocument()
      expect(screen.getByText('进行中')).toBeInTheDocument()
      expect(screen.getByText('已完成')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <Kanban
          className='custom-class'
          items={defaultItems}
          value={defaultValue}
        />
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Kanban
          style={{ gap: '20px' }}
          items={defaultItems}
          value={defaultValue}
        />
      )
      expect(container.firstChild).toHaveStyle({ gap: '20px' })
    })
  })

  describe('卡片渲染 (onItemRender)', () => {
    it('应该使用自定义渲染函数', () => {
      render(
        <Kanban
          items={defaultItems}
          value={defaultValue}
          onItemRender={(data) => <div>{data.name}</div>}
        />
      )
      expect(screen.getByText('任务1')).toBeInTheDocument()
      expect(screen.getByText('任务2')).toBeInTheDocument()
    })
  })

  describe('颜色显示', () => {
    it('应该显示列的颜色标识', () => {
      const { container } = render(
        <Kanban items={defaultItems} value={defaultValue} />
      )
      const colorDots = container.querySelectorAll('.rounded-full')
      expect(colorDots.length).toBeGreaterThan(0)
    })
  })

  describe('字段名称 (fieldNames)', () => {
    it('应该支持自定义字段名称', () => {
      const customValue = [{ key: '1', title: '任务1', status: 'todo' }]
      const { container } = render(
        <Kanban
          items={defaultItems}
          value={customValue}
          fieldNames={{ idKey: 'key', groupKey: 'status' }}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('拖拽回调 (onDrag)', () => {
    it('应该支持 onDrag 回调', () => {
      const onDrag = vi.fn()
      const { container } = render(
        <Kanban items={defaultItems} value={defaultValue} onDrag={onDrag} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带自定义渲染的看板应该正确渲染', () => {
      render(
        <Kanban
          items={defaultItems}
          value={defaultValue}
          onItemRender={(data) => (
            <div className='kanban-card'>
              <h3>{data.name}</h3>
            </div>
          )}
        />
      )
      expect(screen.getByText('待办')).toBeInTheDocument()
      expect(screen.getByText('任务1')).toBeInTheDocument()
    })
  })
})
