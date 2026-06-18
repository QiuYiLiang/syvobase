import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Formula } from '../Formula'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const renderWithDnd = (ui: React.ReactElement) => {
  return render(<DndProvider backend={HTML5Backend}>{ui}</DndProvider>)
}

describe('Formula 公式组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = renderWithDnd(<Formula />)
      // 使用 data-tag 属性选择器
      expect(
        container.querySelector('[data-tag="nk-formula"]')
      ).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = renderWithDnd(<Formula className='custom-class' />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = renderWithDnd(
        <Formula style={{ width: '500px' }} />
      )
      expect(container.firstChild).toHaveStyle({ width: '500px' })
    })
  })

  describe('值 (value)', () => {
    it('应该支持传入初始值', () => {
      const { container } = renderWithDnd(<Formula value='SUM(1,2)' />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('字段项 (items)', () => {
    it('应该渲染字段树', () => {
      const items = [
        { id: 'field1', name: '字段1' },
        { id: 'field2', name: '字段2' },
      ]
      renderWithDnd(<Formula items={items} />)
      expect(screen.getByText('字段1')).toBeInTheDocument()
      expect(screen.getByText('字段2')).toBeInTheDocument()
    })
  })

  describe('函数分类标签页', () => {
    it('应该显示函数分类标签页', () => {
      renderWithDnd(<Formula />)
      expect(screen.getByText(/全部|all/i)).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带值和字段项应该正确渲染', () => {
      const items = [{ id: 'f1', name: '数量' }]
      renderWithDnd(<Formula value='#(f1) + 1' items={items} />)
      // 可能有多个 "数量" 元素，只验证至少存在一个
      expect(screen.getAllByText('数量').length).toBeGreaterThan(0)
    })
  })
})
