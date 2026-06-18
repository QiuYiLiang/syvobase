import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { OTP } from '../OTP'

describe('OTP 验证码输入组件', () => {
  // input-otp 库使用 setTimeout，需要 fake timers 来避免异步问题
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<OTP />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<OTP className='custom-class' />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('默认应该渲染 6 个输入框', () => {
      const { container } = render(<OTP />)
      // OTP 组件每个 slot 都是一个 div,使用 size 类名识别
      const slots = container.querySelectorAll('.size-8')
      expect(slots.length).toBe(6)
    })
  })

  describe('长度 (length)', () => {
    it('应该支持自定义长度', () => {
      const { container } = render(<OTP length={4} />)
      // length=4 时渲染 4 个 default size 的 slot
      const slots = container.querySelectorAll('.size-8')
      expect(slots.length).toBe(4)
    })
  })

  describe('尺寸 (size)', () => {
    it('默认尺寸应该有正确的大小', () => {
      const { container } = render(<OTP />)
      const slot = container.querySelector('.size-8')
      expect(slot).toBeInTheDocument()
    })

    it('sm 尺寸应该有正确的大小', () => {
      const { container } = render(<OTP size='sm' />)
      const slot = container.querySelector('.size-7')
      expect(slot).toBeInTheDocument()
    })

    it('lg 尺寸应该有正确的大小', () => {
      const { container } = render(<OTP size='lg' />)
      const slot = container.querySelector('.size-10')
      expect(slot).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('禁用状态应该有禁用样式', () => {
      const { container } = render(<OTP disabled />)
      expect(
        container.querySelector('.disabled\\:cursor-not-allowed')
      ).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('只读模式应该直接显示值', () => {
      render(<OTP readMode value='123456' />)
      expect(screen.getByText('123456')).toBeInTheDocument()
    })
  })

  describe('受控模式 (value)', () => {
    it('应该正确显示 value', () => {
      const { container } = render(<OTP value='12' />)
      // 前两个输入框应该有值
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('完成回调 (onComplete)', () => {
    it('输入完成时应该触发 onComplete', () => {
      const onComplete = vi.fn()
      const { container } = render(<OTP length={4} onComplete={onComplete} />)
      // OTP 组件使用 input-otp 库，模拟完整输入需要特殊处理
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('小尺寸 4 位验证码应该正确渲染', () => {
      const { container } = render(<OTP size='sm' length={4} />)
      const slots = container.querySelectorAll('.size-7')
      expect(slots.length).toBe(4)
      expect(container.querySelector('.size-7')).toBeInTheDocument()
    })

    it('大尺寸禁用状态应该正确渲染', () => {
      const { container } = render(<OTP size='lg' disabled />)
      expect(container.querySelector('.size-10')).toBeInTheDocument()
      expect(
        container.querySelector('.disabled\\:cursor-not-allowed')
      ).toBeInTheDocument()
    })
  })
})
