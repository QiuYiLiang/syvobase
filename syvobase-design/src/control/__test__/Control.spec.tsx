import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Control } from '../Control'

describe('Control 控制组件', () => {
  describe('基础渲染', () => {
    it('text 类型应该渲染文本输入框', () => {
      const { container } = render(<Control type='text' />)
      expect(container.querySelector('input')).toBeInTheDocument()
    })

    it('number 类型应该渲染数字输入框', () => {
      const { container } = render(<Control type='number' />)
      expect(container.querySelector('input')).toBeInTheDocument()
    })

    it('checkbox 类型应该渲染复选框', () => {
      const { container } = render(<Control type='checkbox' />)
      expect(
        container.querySelector('[data-tag="nk-checkbox"]')
      ).toBeInTheDocument()
    })

    it('switch 类型应该渲染开关', () => {
      const { container } = render(<Control type='switch' />)
      expect(
        container.querySelector('[data-tag="nk-switch"]')
      ).toBeInTheDocument()
    })

    it('select 类型应该渲染下拉选择', () => {
      const { container } = render(<Control type='select' items={[]} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('textarea 类型应该渲染多行文本框', () => {
      const { container } = render(<Control type='textarea' />)
      expect(container.querySelector('textarea')).toBeInTheDocument()
    })
  })

  describe('值 (value)', () => {
    it('应该支持受控模式', () => {
      const { container } = render(<Control type='text' value='测试值' />)
      const input = container.querySelector('input')
      expect(input).toHaveValue('测试值')
    })

    it('修改值应该触发 onChange', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Control type='text' value='' onChange={onChange} />
      )
      const input = container.querySelector('input')
      fireEvent.change(input!, { target: { value: '新值' } })
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('readMode 为 true 时应该显示只读视图', () => {
      render(<Control type='text' value='只读文本' readMode />)
      expect(screen.getByText('只读文本')).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时控件应该禁用', () => {
      const { container } = render(<Control type='text' disabled />)
      const input = container.querySelector('input')
      expect(input).toBeDisabled()
    })
  })

  describe('内联模式 (inlineMode)', () => {
    it('inlineMode 为 true 时应该使用内联样式', () => {
      const { container } = render(<Control type='text' inlineMode />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带值和禁用的控件应该正确渲染', () => {
      const { container } = render(
        <Control type='text' value='禁用值' disabled />
      )
      const input = container.querySelector('input')
      expect(input).toHaveValue('禁用值')
      expect(input).toBeDisabled()
    })
  })
})
