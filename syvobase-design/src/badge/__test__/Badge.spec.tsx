import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'

describe('Badge 徽标组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染 children', () => {
      render(<Badge count={1}>内容</Badge>)
      expect(screen.getByText('内容')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <Badge className='custom-class' count={1}>
          内容
        </Badge>
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('计数显示 (count)', () => {
    it('count > 0 时应该显示徽标数字', () => {
      render(<Badge count={5}>内容</Badge>)
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('count = 0 时不应该显示徽标', () => {
      const { container } = render(<Badge count={0}>内容</Badge>)
      // count 为 0 时不显示徽标
      expect(container.firstChild).toBeInTheDocument()
    })

    it('count > 99 时应该显示 99+', () => {
      render(<Badge count={100}>内容</Badge>)
      expect(screen.getByText('99+')).toBeInTheDocument()
    })

    it('count < 0 时不应该显示徽标', () => {
      const { container } = render(<Badge count={-5}>内容</Badge>)
      // 负数时不显示徽标
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('点状徽标 (dot)', () => {
    it('dot 为 true 时应该显示点状徽标', () => {
      const { container } = render(
        <Badge count={1} dot>
          内容
        </Badge>
      )
      const dot = container.querySelector('.h-3.w-3')
      expect(dot).toBeInTheDocument()
    })

    it('dot 为 true 时不应该显示数字', () => {
      render(
        <Badge count={5} dot>
          内容
        </Badge>
      )
      expect(screen.queryByText('5')).not.toBeInTheDocument()
    })
  })

  describe('徽标类型 (type)', () => {
    it('默认类型应该有 primary 样式', () => {
      const { container } = render(
        <Badge type='default' count={1}>
          内容
        </Badge>
      )
      const badge = container.querySelector('.bg-primary')
      expect(badge).toBeInTheDocument()
    })

    it('secondary 类型应该有 secondary 样式', () => {
      const { container } = render(
        <Badge type='secondary' count={1}>
          内容
        </Badge>
      )
      const badge = container.querySelector('.bg-secondary')
      expect(badge).toBeInTheDocument()
    })

    it('destructive 类型应该有 destructive 样式', () => {
      const { container } = render(
        <Badge type='destructive' count={1}>
          内容
        </Badge>
      )
      const badge = container.querySelector('.bg-destructive')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('动画效果 (animate)', () => {
    it('animate 为 true 时应该有动画元素', () => {
      const { container } = render(
        <Badge count={1} animate>
          内容
        </Badge>
      )
      const animateSpan = container.querySelector('.animate-ping')
      expect(animateSpan).toBeInTheDocument()
    })

    it('默认不应该有动画效果', () => {
      const { container } = render(<Badge count={1}>内容</Badge>)
      const animateSpan = container.querySelector('.animate-ping')
      expect(animateSpan).not.toBeInTheDocument()
    })
  })

  describe('位置 (position)', () => {
    it('应该支持自定义位置', () => {
      const { container } = render(
        <Badge count={1} position={{ left: 10, top: 5 }}>
          内容
        </Badge>
      )
      const badge = container.querySelector('.absolute')
      expect(badge).toHaveStyle({ left: '10px', top: '5px' })
    })
  })

  describe('组合场景', () => {
    it('带动画的点状徽标应该正确渲染', () => {
      const { container } = render(
        <Badge count={1} dot animate>
          内容
        </Badge>
      )
      expect(container.querySelector('.h-3.w-3')).toBeInTheDocument()
      expect(container.querySelector('.animate-ping')).toBeInTheDocument()
    })

    it('带自定义位置的 destructive 徽标应该正确渲染', () => {
      const { container } = render(
        <Badge count={50} type='destructive' position={{ right: 0 }}>
          内容
        </Badge>
      )
      expect(screen.getByText('50')).toBeInTheDocument()
      expect(container.querySelector('.bg-destructive')).toBeInTheDocument()
    })
  })
})
