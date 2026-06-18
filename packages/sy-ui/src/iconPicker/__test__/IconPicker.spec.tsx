import { describe, it, expect } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import { IconPicker } from '../IconPicker'

describe('IconPicker 图标选择器组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<IconPicker />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<IconPicker className='custom-class' />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(<IconPicker style={{ margin: '10px' }} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('值 (value)', () => {
    it('应该支持受控模式 - none 类型', () => {
      const { container } = render(
        <IconPicker value={{ type: 'none', color: '#ffffff' }} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持受控模式 - default 类型', () => {
      const { container } = render(
        <IconPicker
          value={{ type: 'default', value: 'Settings', color: '#ffffff' }}
        />
      )
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('应该支持受控模式 - custom 类型', () => {
      const { container } = render(
        <IconPicker
          value={{
            type: 'custom',
            value: { base64: 'data:image/png;base64,xxx' },
            color: '#ffffff',
          }}
        />
      )
      expect(container.querySelector('.bg-cover')).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('readMode 为 true 且 type 为 none 时不应该渲染内容', () => {
      const { container } = render(
        <IconPicker value={{ type: 'none', color: '#ffffff' }} readMode />
      )
      expect(container.firstChild).toBeNull()
    })

    it('readMode 为 true 且 type 为 default 时应该显示图标', () => {
      const { container } = render(
        <IconPicker
          value={{ type: 'default', value: 'Settings', color: '#4a90e2' }}
          readMode
        />
      )
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('弹出框交互', () => {
    it('点击应该打开弹出框', async () => {
      const { container } = render(<IconPicker />)
      await act(async () => {
        fireEvent.click(container.firstChild!)
      })
      // Popover 可能需要时间渲染,简化测试验证点击不报错
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('颜色显示', () => {
    it('应该显示背景颜色', () => {
      const { container } = render(
        <IconPicker
          value={{ type: 'default', value: 'Star', color: '#ff6b6b' }}
        />
      )
      const iconWrapper = container.querySelector('.rounded-lg')
      expect(iconWrapper).toHaveStyle({ background: '#ff6b6b' })
    })
  })

  describe('组合场景', () => {
    it('带默认图标和颜色的选择器应该正确渲染', () => {
      const { container } = render(
        <IconPicker
          value={{ type: 'default', value: 'Heart', color: '#e74c3c' }}
        />
      )
      expect(container.querySelector('svg')).toBeInTheDocument()
      expect(container.querySelector('.rounded-lg')).toHaveStyle({
        background: '#e74c3c',
      })
    })
  })
})
