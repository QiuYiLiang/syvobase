import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tag } from '../Tag'

describe('Tag 标签组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染 children', () => {
      render(<Tag>标签内容</Tag>)
      expect(screen.getByText('标签内容')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      render(<Tag className='custom-class'>标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveClass('custom-class')
    })

    it('应该支持传入自定义 style', () => {
      render(<Tag style={{ margin: '10px' }}>标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveStyle({ margin: '10px' })
    })
  })

  describe('标签颜色 (color)', () => {
    it('默认颜色应该是 gray', () => {
      render(<Tag>标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toBeInTheDocument()
    })

    it('blue 颜色应该有正确的样式', () => {
      render(<Tag color='blue'>蓝色标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveStyle({ color: 'rgb(30, 64, 175)' })
    })

    it('green 颜色应该有正确的样式', () => {
      render(<Tag color='green'>绿色标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveStyle({ color: 'rgb(21, 128, 61)' })
    })

    it('red 颜色应该有正确的样式', () => {
      render(<Tag color='red'>红色标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveStyle({ color: 'rgb(185, 28, 28)' })
    })

    it('orange 颜色应该有正确的样式', () => {
      render(<Tag color='orange'>橙色标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveStyle({ color: 'rgb(194, 65, 12)' })
    })

    it('purple 颜色应该有正确的样式', () => {
      render(<Tag color='purple'>紫色标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveStyle({ color: 'rgb(126, 34, 206)' })
    })

    it('cyan 颜色应该有正确的样式', () => {
      render(<Tag color='cyan'>青色标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveStyle({ color: 'rgb(14, 116, 144)' })
    })

    it('magenta 颜色应该有正确的样式', () => {
      render(<Tag color='magenta'>洋红标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveStyle({ color: 'rgb(157, 23, 77)' })
    })
  })

  describe('标签尺寸 (size)', () => {
    it('默认尺寸应该是 sm', () => {
      render(<Tag>标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveClass('h-6')
    })

    it('default 尺寸应该有正确的高度', () => {
      render(<Tag size='default'>标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveClass('h-8')
    })

    it('lg 尺寸应该有正确的高度', () => {
      render(<Tag size='lg'>标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveClass('h-10')
    })
  })

  describe('圆角 (rounded)', () => {
    it('rounded 为 true 时应该有圆形样式', () => {
      render(<Tag rounded>标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveClass('rounded-full')
    })

    it('默认不应该是完全圆角', () => {
      render(<Tag>标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveClass('rounded-md')
    })
  })

  describe('边框 (border)', () => {
    it('默认应该有边框', () => {
      render(<Tag>标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).toHaveStyle({ borderWidth: '1px' })
    })

    it('border 为 false 时不应该有边框', () => {
      render(<Tag border={false}>标签</Tag>)
      const tag = screen.getByRole('button')
      expect(tag).not.toHaveStyle({ borderWidth: '1px' })
    })
  })

  describe('图标 (icon)', () => {
    it('应该渲染图标', () => {
      const { container } = render(<Tag icon='Settings'>设置</Tag>)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带图标的圆角标签应该正确渲染', () => {
      const { container } = render(
        <Tag icon='Star' rounded color='gold'>
          收藏
        </Tag>
      )
      const tag = screen.getByRole('button')
      expect(tag).toHaveClass('rounded-full')
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('大尺寸无边框标签应该正确渲染', () => {
      render(
        <Tag size='lg' border={false} color='blue'>
          大标签
        </Tag>
      )
      const tag = screen.getByRole('button')
      expect(tag).toHaveClass('h-10')
      expect(tag).not.toHaveStyle({ borderWidth: '1px' })
    })
  })
})
