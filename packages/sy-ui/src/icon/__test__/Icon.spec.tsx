import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Icon } from '../Icon'

describe('Icon 图标组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染 Lucide 图标', () => {
      const { container } = render(<Icon name='Settings' />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <Icon name='Settings' className='custom-class' />
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Icon name='Settings' style={{ margin: '5px' }} />
      )
      expect(container.querySelector('svg')).toHaveStyle({ margin: '5px' })
    })
  })

  describe('颜色 (color)', () => {
    it('应该支持自定义颜色', () => {
      const { container } = render(<Icon name='Heart' color='red' />)
      // 浏览器会将颜色名称转换为 RGB 格式
      expect(container.querySelector('svg')).toHaveStyle({
        color: 'rgb(255, 0, 0)',
      })
    })
  })

  describe('尺寸 (size)', () => {
    it('应该支持自定义尺寸', () => {
      const { container } = render(<Icon name='Star' size='24px' />)
      expect(container.querySelector('svg')).toHaveStyle({ fontSize: '24px' })
    })
  })

  describe('空名称', () => {
    it('name 为空时不应该渲染', () => {
      const { container } = render(<Icon name='' />)
      expect(container.querySelector('svg')).not.toBeInTheDocument()
    })
  })

  describe('动画图标', () => {
    it('Loader 图标应该有旋转动画', () => {
      const { container } = render(<Icon name='Loader' />)
      expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('LoaderCircle 图标应该有旋转动画', () => {
      const { container } = render(<Icon name='LoaderCircle' />)
      expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带颜色和尺寸的图标应该正确渲染', () => {
      const { container } = render(
        <Icon name='Check' color='green' size='32px' />
      )
      const svg = container.querySelector('svg')
      // 浏览器会将颜色名称转换为 RGB 格式
      expect(svg).toHaveStyle({ color: 'rgb(0, 128, 0)', fontSize: '32px' })
    })
  })
})
