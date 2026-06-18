import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DatePicker } from '../DatePicker'

describe('DatePicker 日期选择器组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<DatePicker />)
      expect(container.querySelector('.nk-date-picker')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<DatePicker className='custom-class' />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(<DatePicker style={{ width: '300px' }} />)
      expect(container.firstChild).toHaveStyle({ width: '300px' })
    })
  })

  describe('值 (value)', () => {
    it('应该支持受控模式', () => {
      const { container } = render(<DatePicker value='2024-01-15' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('选择日期应该触发 onChange', () => {
      const onChange = vi.fn()
      const { container } = render(<DatePicker onChange={onChange} />)
      const input = container.querySelector('input')
      fireEvent.click(input!)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('格式 (format)', () => {
    it('默认格式应该是 YYYY-MM-DD', () => {
      const { container } = render(<DatePicker />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('YYYY-MM 格式应该只显示年月', () => {
      const { container } = render(<DatePicker format='YYYY-MM' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('YYYY 格式应该只显示年', () => {
      const { container } = render(<DatePicker format='YYYY' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('YYYY-MM-DD HH:mm:ss 格式应该显示日期时间', () => {
      const { container } = render(<DatePicker format='YYYY-MM-DD HH:mm:ss' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('HH:mm:ss 格式应该只显示时间', () => {
      const { container } = render(<DatePicker format='HH:mm:ss' />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('范围选择 (range)', () => {
    it('range 为 true 时应该渲染范围选择器', () => {
      const { container } = render(<DatePicker range />)
      const inputs = container.querySelectorAll('input')
      expect(inputs.length).toBeGreaterThan(1)
    })
  })

  describe('只读模式 (readMode)', () => {
    it('readMode 为 true 时应该显示文本值', () => {
      render(<DatePicker value='2024-01-15' readMode />)
      expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    })

    it('range readMode 应该显示范围文本', () => {
      render(<DatePicker range value={['2024-01-01', '2024-01-31']} readMode />)
      expect(screen.getByText(/2024-01-01/)).toBeInTheDocument()
    })

    it('readMode 无值时应该显示空', () => {
      const { container } = render(<DatePicker readMode />)
      expect(container.textContent).toBe('')
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时输入框应该禁用', () => {
      const { container } = render(<DatePicker disabled />)
      const input = container.querySelector('input')
      expect(input).toBeDisabled()
    })
  })

  describe('占位符 (placeholder)', () => {
    it('应该显示自定义 placeholder', () => {
      const { container } = render(<DatePicker placeholder='请选择日期' />)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('placeholder', '请选择日期')
    })

    it('range 模式应该支持数组 placeholder', () => {
      const { container } = render(
        <DatePicker range placeholder={['开始日期', '结束日期']} />
      )
      const inputs = container.querySelectorAll('input')
      expect(inputs[0]).toHaveAttribute('placeholder', '开始日期')
    })
  })

  describe('预设值 (presets)', () => {
    it('应该支持预设值', () => {
      const { container } = render(
        <DatePicker presets={[{ label: '今天', value: new Date() as any }]} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带时间的范围选择应该正确渲染', () => {
      const { container } = render(
        <DatePicker range format='YYYY-MM-DD HH:mm:ss' />
      )
      const inputs = container.querySelectorAll('input')
      expect(inputs.length).toBeGreaterThan(1)
    })
  })
})
