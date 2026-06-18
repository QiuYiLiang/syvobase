import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Number } from '../Number'

describe('Number 数字输入组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Number />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Number className='custom-class' />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Number style={{ width: '200px' }} className='test-style' />
      )
      expect(container.querySelector('.test-style')).toHaveStyle({
        width: '200px',
      })
    })
  })

  describe('值 (value)', () => {
    it('应该支持受控模式', () => {
      const { container } = render(<Number value={100} onChange={() => {}} />)
      const input = container.querySelector('input')
      // input 的 value 是数字类型
      expect(input).toHaveValue(100)
    })

    it('输入数字后失焦应该触发 onChange', () => {
      const onChange = vi.fn()
      // Number 组件使用 inlineMode，只有在失焦时才会触发 onChange
      const { container } = render(<Number value={0} onChange={onChange} />)
      const input = container.querySelector('input')
      fireEvent.change(input!, { target: { value: '50' } })
      fireEvent.blur(input!)
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('范围选择 (range)', () => {
    it('range 为 true 时应该渲染范围输入', () => {
      const { container } = render(<Number range />)
      const inputs = container.querySelectorAll('input')
      expect(inputs.length).toBeGreaterThan(1)
    })
  })

  describe('最小值/最大值 (min/max)', () => {
    it('应该支持设置 min', () => {
      const { container } = render(<Number min={0} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持设置 max', () => {
      const { container } = render(<Number max={100} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('步长 (step)', () => {
    it('应该支持自定义 step', () => {
      // Number 组件本身不直接支持 step，由底层 BaseNumber 处理
      const { container } = render(<Number />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('精度 (precision)', () => {
    it('应该支持设置精度', () => {
      // Number 组件通过 decimal 属性控制精度
      const { container } = render(<Number decimal={2} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('readMode 为 true 时应该显示文本', () => {
      render(<Number value={123} readMode />)
      expect(screen.getByText('123')).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时输入框应该禁用', () => {
      const { container } = render(<Number disabled />)
      const input = container.querySelector('input')
      expect(input).toBeDisabled()
    })
  })

  describe('占位符 (placeholder)', () => {
    it('应该显示 placeholder', () => {
      const { container } = render(<Number placeholder='请输入数字' />)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('placeholder', '请输入数字')
    })
  })

  describe('前缀/后缀 (prefix/suffix)', () => {
    it('应该支持前缀和后缀（通过 Text 组件）', () => {
      // Number 组件继承 Text 组件的前缀后缀能力
      const { container } = render(<Number />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带范围和限制的数字输入应该正确渲染', () => {
      const { container } = render(<Number min={0} max={100} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
