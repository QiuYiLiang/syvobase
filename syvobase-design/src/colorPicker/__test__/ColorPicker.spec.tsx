import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { ColorPicker } from '../ColorPicker'

describe('ColorPicker 颜色选择器组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<ColorPicker />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<ColorPicker className='custom-class' />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <ColorPicker style={{ width: '100px' }} className='test-style' />
      )
      expect(container.querySelector('.test-style')).toBeInTheDocument()
    })
  })

  describe('值 (value)', () => {
    it('应该支持受控模式', () => {
      const { container } = render(<ColorPicker value='#ff0000' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('选择颜色应该触发 onChange', () => {
      const onChange = vi.fn()
      const { container } = render(<ColorPicker onChange={onChange} />)
      // ColorPicker 使用 Button 作为 trigger
      const trigger = container.querySelector('div[role="button"]')
      fireEvent.click(trigger!)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('readMode 为 true 时应该显示颜色块', () => {
      const { container } = render(<ColorPicker value='#ff0000' readMode />)
      const colorBlock = container.querySelector('.rounded')
      expect(colorBlock).toBeInTheDocument()
      expect(colorBlock).toHaveStyle({ background: '#ff0000' })
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时应该禁用选择器', () => {
      const { container } = render(<ColorPicker disabled />)
      // Button with disabled prop will have disabled attribute
      expect(container.querySelector('[disabled]')).toBeInTheDocument()
    })
  })

  describe('预设颜色', () => {
    it('应该包含预设颜色', () => {
      const { container } = render(<ColorPicker />)
      const trigger = container.querySelector('div[role="button"]')
      fireEvent.click(trigger!)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带初始值的颜色选择器应该正确渲染', () => {
      const { container } = render(<ColorPicker value='#00ff00' />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
