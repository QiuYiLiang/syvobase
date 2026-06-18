import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Data } from '../Data'

describe('Data 数据容器组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染子元素', () => {
      render(<Data>数据内容</Data>)
      expect(screen.getByText('数据内容')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Data className='custom-class'>内容</Data>)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Data style={{ padding: '20px' }}>内容</Data>
      )
      expect(container.firstChild).toHaveStyle({ padding: '20px' })
    })
  })

  describe('工具栏 (toolbar)', () => {
    it('应该渲染工具栏', () => {
      render(<Data toolbar={[{ name: '添加' }, { name: '删除' }]}>内容</Data>)
      expect(screen.getByText('添加')).toBeInTheDocument()
      expect(screen.getByText('删除')).toBeInTheDocument()
    })
  })

  describe('筛选器 (filter)', () => {
    it('应该渲染筛选器', () => {
      const { container } = render(
        <Data filter={{ value: { op: 'and', items: [] } }}>内容</Data>
      )
      expect(
        container.querySelector('[data-tag=nk-filter]')
      ).toBeInTheDocument()
    })
  })

  describe('分页 (pagination)', () => {
    it('应该渲染分页', () => {
      const { container } = render(
        <Data pagination={{ index: 0, total: 100 }}>内容</Data>
      )
      expect(
        container.querySelector('[data-tag=nk-pagination]')
      ).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带工具栏和分页的数据容器应该正确渲染', () => {
      const { container } = render(
        <Data toolbar={[{ name: '刷新' }]} pagination={{ index: 0, total: 50 }}>
          <div>数据列表</div>
        </Data>
      )
      expect(screen.getByText('刷新')).toBeInTheDocument()
      expect(screen.getByText('数据列表')).toBeInTheDocument()
      expect(
        container.querySelector('[data-tag=nk-pagination]')
      ).toBeInTheDocument()
    })
  })
})
