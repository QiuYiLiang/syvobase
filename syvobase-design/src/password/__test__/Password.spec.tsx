import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Password } from '../Password'

describe('Password 密码输入组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Password />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该渲染密码类型的输入框', () => {
      const { container } = render(<Password />)
      const input = container.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
    })
  })

  describe('值 (value)', () => {
    it('应该支持受控模式', () => {
      const { container } = render(<Password value='secret123' />)
      const input = container.querySelector('input')
      expect(input).toHaveValue('secret123')
    })

    it('输入密码应该触发 onChange', () => {
      const onChange = vi.fn()
      const { container } = render(<Password value='' onChange={onChange} />)
      const input = container.querySelector('input')
      fireEvent.change(input!, { target: { value: 'newpassword' } })
      expect(onChange).toHaveBeenCalledWith('newpassword')
    })
  })

  describe('只读模式 (readMode)', () => {
    it('readMode 为 true 时默认应该显示星号', () => {
      render(<Password value='secret' readMode />)
      expect(screen.getByText('******')).toBeInTheDocument()
    })

    it('readMode 时应该显示查看按钮', () => {
      render(<Password value='secret' readMode />)
      const viewButton = screen.getByRole('button')
      expect(viewButton).toBeInTheDocument()
    })

    it('点击查看按钮应该显示密码', () => {
      render(<Password value='secret123' readMode />)
      const viewButton = screen.getByRole('button')
      fireEvent.click(viewButton)
      expect(screen.getByText('secret123')).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时输入框应该禁用', () => {
      const { container } = render(<Password disabled />)
      const input = container.querySelector('input')
      expect(input).toBeDisabled()
    })
  })

  describe('占位符 (placeholder)', () => {
    it('应该显示 placeholder', () => {
      const { container } = render(<Password placeholder='请输入密码' />)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('placeholder', '请输入密码')
    })
  })

  describe('组合场景', () => {
    it('带占位符的密码输入应该正确渲染', () => {
      const { container } = render(<Password placeholder='请输入密码' />)
      const input = container.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('placeholder', '请输入密码')
    })
  })
})
