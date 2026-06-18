import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Switch } from '../Switch'

describe('Switch 开关组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Switch />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Switch className='custom-class' />)
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('开关状态 (value)', () => {
    it('默认应该是关闭状态', () => {
      const { container } = render(<Switch />)
      const switchTrack = container.querySelector('.bg-muted')
      expect(switchTrack).toBeInTheDocument()
    })

    it('value 为 true 时应该显示开启状态', () => {
      const { container } = render(<Switch value={true} />)
      const switchTrack = container.querySelector('.bg-primary')
      expect(switchTrack).toBeInTheDocument()
    })

    it('点击应该切换开关状态', () => {
      const onChange = vi.fn()
      const { container } = render(<Switch value={false} onChange={onChange} />)
      const switchElement = container.querySelector('.cursor-pointer')
      fireEvent.click(switchElement!)
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('开启状态下点击应该关闭', () => {
      const onChange = vi.fn()
      const { container } = render(<Switch value={true} onChange={onChange} />)
      const switchElement = container.querySelector('.cursor-pointer')
      fireEvent.click(switchElement!)
      expect(onChange).toHaveBeenCalledWith(false)
    })
  })

  describe('滑块位置', () => {
    it('关闭状态滑块应该在左侧', () => {
      const { container } = render(<Switch value={false} />)
      const thumb = container.querySelector('.translate-x-0')
      expect(thumb).toBeInTheDocument()
    })

    it('开启状态滑块应该在右侧', () => {
      const { container } = render(<Switch value={true} />)
      const thumb = container.querySelector('.translate-x-5')
      expect(thumb).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('禁用状态应该有 cursor-not-allowed 样式', () => {
      const { container } = render(<Switch disabled />)
      const switchElement = container.querySelector('.cursor-not-allowed')
      expect(switchElement).toBeInTheDocument()
    })

    it('禁用状态应该有 opacity-50 样式', () => {
      const { container } = render(<Switch disabled />)
      const switchElement = container.querySelector('.opacity-50')
      expect(switchElement).toBeInTheDocument()
    })

    it('禁用状态点击不应该触发 onChange', () => {
      const onChange = vi.fn()
      const { container } = render(<Switch disabled onChange={onChange} />)
      const switchElement = container.querySelector('.pointer-events-none')
      fireEvent.click(switchElement!)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('只读模式应该有禁用样式', () => {
      const { container } = render(<Switch readMode />)
      const switchElement = container.querySelector('.cursor-not-allowed')
      expect(switchElement).toBeInTheDocument()
    })

    it('只读模式点击不应该触发 onChange', () => {
      const onChange = vi.fn()
      const { container } = render(<Switch readMode onChange={onChange} />)
      const switchElement = container.querySelector('.pointer-events-none')
      fireEvent.click(switchElement!)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('组合场景', () => {
    it('禁用的开启状态应该正确渲染', () => {
      const { container } = render(<Switch disabled value={true} />)
      expect(container.querySelector('.bg-primary')).toBeInTheDocument()
      expect(container.querySelector('.opacity-50')).toBeInTheDocument()
      expect(container.querySelector('.translate-x-5')).toBeInTheDocument()
    })

    it('只读的关闭状态应该正确渲染', () => {
      const { container } = render(<Switch readMode value={false} />)
      expect(container.querySelector('.bg-muted')).toBeInTheDocument()
      expect(container.querySelector('.opacity-50')).toBeInTheDocument()
      expect(container.querySelector('.translate-x-0')).toBeInTheDocument()
    })
  })
})
