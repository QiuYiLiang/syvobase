import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Empty } from '../Empty'

describe('Empty 空状态组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Empty />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Empty className='custom-class' />)
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('应该渲染 Inbox 图标', () => {
      const { container } = render(<Empty />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('子内容 (children)', () => {
    it('应该渲染 children 内容', () => {
      render(<Empty>暂无数据</Empty>)
      expect(screen.getByText('暂无数据')).toBeInTheDocument()
    })

    it('没有 children 时只显示图标', () => {
      const { container } = render(<Empty />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(container.textContent).toBe('')
    })
  })

  describe('样式', () => {
    it('应该居中显示', () => {
      const { container } = render(<Empty />)
      expect(container.firstChild).toHaveClass('flex')
      expect(container.firstChild).toHaveClass('items-center')
      expect(container.firstChild).toHaveClass('justify-center')
    })

    it('应该占满宽度', () => {
      const { container } = render(<Empty />)
      expect(container.firstChild).toHaveClass('w-full')
    })
  })

  describe('组合场景', () => {
    it('带自定义内容的空状态应该正确渲染', () => {
      render(
        <Empty>
          <p>没有找到相关数据</p>
          <button>刷新</button>
        </Empty>
      )
      expect(screen.getByText('没有找到相关数据')).toBeInTheDocument()
      expect(screen.getByText('刷新')).toBeInTheDocument()
    })

    it('带自定义 className 的空状态应该正确渲染', () => {
      const { container } = render(
        <Empty className='h-64 bg-gray-50'>暂无数据</Empty>
      )
      expect(container.firstChild).toHaveClass('h-64')
      expect(container.firstChild).toHaveClass('bg-gray-50')
    })
  })
})
