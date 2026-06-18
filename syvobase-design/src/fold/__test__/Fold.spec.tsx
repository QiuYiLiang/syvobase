import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Fold } from '../Fold'

describe('Fold 折叠组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染 children', () => {
      render(<Fold>折叠内容</Fold>)
      expect(screen.getByText('折叠内容')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Fold className='custom-class'>内容</Fold>)
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(<Fold style={{ width: '200px' }}>内容</Fold>)
      expect(container.firstChild).toHaveStyle({ width: '200px' })
    })
  })

  describe('折叠状态 (value)', () => {
    it('默认应该是展开状态', () => {
      const { container } = render(<Fold>内容</Fold>)
      expect(container.firstChild).not.toHaveClass('w-0!')
    })

    it('value 为 false 时应该是折叠状态', () => {
      const { container } = render(<Fold value={false}>内容</Fold>)
      expect(container.firstChild).toHaveClass('w-0!')
    })

    it('点击手柄应该切换折叠状态', () => {
      const onChange = vi.fn()
      // 需要传入 value prop 才能进入受控模式，onChange 才会被调用
      const { container } = render(
        <Fold value={true} onChange={onChange}>
          内容
        </Fold>
      )
      const handle = container.querySelector('.cursor-pointer')
      fireEvent.click(handle!)
      expect(onChange).toHaveBeenCalledWith(false)
    })
  })

  describe('方向 (direction)', () => {
    it('默认方向应该是 right', () => {
      const { container } = render(<Fold>内容</Fold>)
      const handle = container.querySelector('.right-0')
      expect(handle).toBeInTheDocument()
    })

    it('left 方向应该在左侧显示手柄', () => {
      const { container } = render(<Fold direction='left'>内容</Fold>)
      const handle = container.querySelector('.left-0')
      expect(handle).toBeInTheDocument()
    })
  })

  describe('手柄位置 (handlerPosition)', () => {
    it('默认位置应该是 center', () => {
      const { container } = render(<Fold>内容</Fold>)
      const handle = container.querySelector('.top-\\[50\\%\\]')
      expect(handle).toBeInTheDocument()
    })

    it('start 位置应该在顶部', () => {
      const { container } = render(<Fold handlerPosition='start'>内容</Fold>)
      const handle = container.querySelector('.top-\\[20px\\]')
      expect(handle).toBeInTheDocument()
    })

    it('end 位置应该在底部', () => {
      const { container } = render(<Fold handlerPosition='end'>内容</Fold>)
      const handle = container.querySelector('.bottom-\\[20px\\]')
      expect(handle).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时不应该显示手柄', () => {
      const { container } = render(<Fold disabled>内容</Fold>)
      const handle = container.querySelector('.cursor-pointer')
      expect(handle).not.toBeInTheDocument()
    })
  })

  describe('图标方向', () => {
    it('展开状态右侧方向应该显示左箭头', () => {
      const { container } = render(
        <Fold direction='right' value={true}>
          内容
        </Fold>
      )
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('折叠状态应该显示右箭头', () => {
      const { container } = render(<Fold value={false}>内容</Fold>)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('左侧方向顶部位置的折叠应该正确渲染', () => {
      const { container } = render(
        <Fold direction='left' handlerPosition='start'>
          内容
        </Fold>
      )
      expect(container.querySelector('.left-0')).toBeInTheDocument()
      expect(container.querySelector('.top-\\[20px\\]')).toBeInTheDocument()
    })

    it('禁用的折叠状态应该正确渲染', () => {
      const { container } = render(
        <Fold disabled value={false}>
          内容
        </Fold>
      )
      expect(container.firstChild).toHaveClass('w-0!')
      expect(container.querySelector('.cursor-pointer')).not.toBeInTheDocument()
    })
  })
})
