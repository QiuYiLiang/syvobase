import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Loading } from '../Loading'

describe('Loading 加载组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Loading />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Loading className='custom-class' />)
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(<Loading style={{ height: '100px' }} />)
      expect(container.firstChild).toHaveStyle({ height: '100px' })
    })
  })

  describe('加载类型 (type)', () => {
    it('默认类型应该渲染加载图标', () => {
      const { container } = render(<Loading type='default' />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('mask 类型应该有遮罩样式', () => {
      const { container } = render(<Loading type='mask' />)
      expect(container.firstChild).toHaveClass('absolute')
      expect(container.firstChild).toHaveClass('bg-secondary/30')
    })

    it('skeleton 类型应该渲染骨架屏', () => {
      const { container } = render(<Loading type='skeleton' />)
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('加载尺寸 (size)', () => {
    it('默认尺寸应该有正确的图标大小', () => {
      const { container } = render(<Loading size='default' />)
      const icon = container.querySelector('.text-3xl')
      expect(icon).toBeInTheDocument()
    })

    it('sm 尺寸应该有正确的图标大小', () => {
      const { container } = render(<Loading size='sm' />)
      const icon = container.querySelector('.text-2xl')
      expect(icon).toBeInTheDocument()
    })

    it('lg 尺寸应该有正确的图标大小', () => {
      const { container } = render(<Loading size='lg' />)
      const icon = container.querySelector('.text-5xl')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('子内容 (children)', () => {
    it('应该渲染 children 内容', () => {
      render(<Loading>加载中...</Loading>)
      expect(screen.getByText('加载中...')).toBeInTheDocument()
    })
  })

  describe('骨架屏类型', () => {
    it('skeleton 类型应该渲染 4 个骨架条', () => {
      const { container } = render(<Loading type='skeleton' />)
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBe(4)
    })

    it('skeleton 类型应该有不同宽度的骨架条', () => {
      const { container } = render(<Loading type='skeleton' />)
      expect(container.querySelector('.w-\\[38\\.2\\%\\]')).toBeInTheDocument()
      expect(container.querySelector('.w-full')).toBeInTheDocument()
      expect(container.querySelector('.w-\\[61\\.8\\%\\]')).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带文字的 mask 加载应该正确渲染', () => {
      const { container } = render(<Loading type='mask'>请稍候...</Loading>)
      expect(container.firstChild).toHaveClass('absolute')
      expect(screen.getByText('请稍候...')).toBeInTheDocument()
    })

    it('大尺寸默认加载应该正确渲染', () => {
      const { container } = render(<Loading size='lg' />)
      const icon = container.querySelector('.text-5xl')
      expect(icon).toBeInTheDocument()
    })
  })
})
