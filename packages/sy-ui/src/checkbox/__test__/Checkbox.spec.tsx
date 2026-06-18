import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from '../Checkbox'

describe('Checkbox 复选框组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Checkbox />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Checkbox className='custom-class' />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(<Checkbox style={{ margin: '5px' }} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('选中状态 (value)', () => {
    it('默认应该是未选中状态', () => {
      const { container } = render(<Checkbox />)
      const checkbox = container.querySelector('.bg-primary')
      expect(checkbox).not.toBeInTheDocument()
    })

    it('value 为 true 时应该显示选中状态', () => {
      const { container } = render(<Checkbox value={true} />)
      const checkbox = container.querySelector('.bg-primary')
      expect(checkbox).toBeInTheDocument()
    })

    it('点击应该切换选中状态', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Checkbox value={false} onChange={onChange} />
      )
      const checkbox = container.querySelector('.cursor-pointer')
      fireEvent.click(checkbox!)
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('禁用状态应该有 cursor-not-allowed 样式', () => {
      const { container } = render(<Checkbox disabled />)
      const checkbox = container.querySelector('.cursor-not-allowed')
      expect(checkbox).toBeInTheDocument()
    })

    it('禁用状态点击不应该触发 onChange', () => {
      const onChange = vi.fn()
      const { container } = render(<Checkbox disabled onChange={onChange} />)
      const checkbox = container.querySelector('.opacity-50')
      fireEvent.click(checkbox!)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('只读模式应该有禁用样式', () => {
      const { container } = render(<Checkbox readMode />)
      const checkbox = container.querySelector('.cursor-not-allowed')
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('半选状态 (indeterminate)', () => {
    it('半选状态应该显示特殊图标', () => {
      const { container } = render(<Checkbox value={true} indeterminate />)
      // 半选状态时会显示一个小方块而不是勾选图标
      const indeterminateIcon = container.querySelector(
        '.size-2.rounded-\\[3px\\]'
      )
      expect(indeterminateIcon).toBeInTheDocument()
    })
  })

  describe('圆形样式 (rounded)', () => {
    it('rounded 为 true 时应该有圆形样式', () => {
      const { container } = render(<Checkbox rounded />)
      const checkbox = container.querySelector('.rounded-full')
      expect(checkbox).toBeInTheDocument()
    })

    it('rounded 选中时应该显示圆形指示器', () => {
      const { container } = render(<Checkbox rounded value={true} />)
      const indicator = container.querySelector('.rounded-full.size-2')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('名称标签 (name)', () => {
    it('应该正确渲染名称标签', () => {
      render(<Checkbox name='同意条款' />)
      expect(screen.getByText('同意条款')).toBeInTheDocument()
    })

    it('点击名称也应该切换选中状态', () => {
      const onChange = vi.fn()
      render(<Checkbox name='同意条款' value={false} onChange={onChange} />)
      fireEvent.click(screen.getByText('同意条款'))
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('Pills 样式 (styleType)', () => {
    it('styleType 为 pills 时应该渲染为按钮样式', () => {
      render(<Checkbox styleType='pills' name='选项' />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('pills 样式选中时应该有 default 类型按钮样式', () => {
      render(<Checkbox styleType='pills' name='选项' value={true} />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary')
    })

    it('pills 样式未选中时应该有 ghost 类型按钮样式', () => {
      render(<Checkbox styleType='pills' name='选项' value={false} />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-secondary')
    })
  })

  describe('组合场景', () => {
    it('禁用的选中状态应该正确渲染', () => {
      const { container } = render(<Checkbox disabled value={true} />)
      expect(container.querySelector('.bg-primary')).toBeInTheDocument()
      expect(container.querySelector('.opacity-50')).toBeInTheDocument()
    })

    it('带名称的圆形复选框应该正确渲染', () => {
      const { container } = render(
        <Checkbox rounded name='选项' value={true} />
      )
      expect(screen.getByText('选项')).toBeInTheDocument()
      expect(container.querySelector('.rounded-full')).toBeInTheDocument()
    })
  })
})
