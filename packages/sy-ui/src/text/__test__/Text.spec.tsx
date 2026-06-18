import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Text } from '../Text'

describe('Text 文本输入组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Text />)
      expect(container.querySelector('input')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Text className='custom-class' />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Text style={{ width: '200px' }} className='test-style' />
      )
      expect(container.querySelector('.test-style')).toHaveStyle({
        width: '200px',
      })
    })
  })

  describe('输入值 (value)', () => {
    it('应该正确显示 value', () => {
      render(<Text value='测试内容' />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('测试内容')
    })

    it('输入应该触发 onChange', () => {
      const onChange = vi.fn()
      render(<Text value='' onChange={onChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '新内容' } })
      expect(onChange).toHaveBeenCalledWith('新内容')
    })

    it('默认 value 应该是空字符串', () => {
      render(<Text />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })
  })

  describe('占位符 (placeholder)', () => {
    it('应该正确显示 placeholder', () => {
      render(<Text placeholder='请输入' />)
      const input = screen.getByPlaceholderText('请输入')
      expect(input).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('禁用状态应该有遮罩层', () => {
      const { container } = render(<Text disabled />)
      const overlay = container.querySelector('.cursor-not-allowed')
      expect(overlay).toBeInTheDocument()
    })

    it('禁用状态输入框应该有 disabled 属性', () => {
      render(<Text disabled />)
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('只读模式应该直接显示值', () => {
      render(<Text readMode value='只读内容' />)
      expect(screen.getByText('只读内容')).toBeInTheDocument()
    })

    it('只读模式值为空时应该显示空白', () => {
      const { container } = render(<Text readMode value='' />)
      // 空值时组件渲染一个 nbsp 占位
      expect(container.textContent).toContain('\u00a0')
    })
  })

  describe('输入尺寸 (size)', () => {
    it('默认尺寸应该有正确的高度', () => {
      const { container } = render(
        <Text size='default' className='test-size' />
      )
      expect(container.querySelector('.test-size')).toHaveClass('h-8')
    })

    it('sm 尺寸应该有正确的高度', () => {
      const { container } = render(<Text size='sm' className='test-size' />)
      expect(container.querySelector('.test-size')).toHaveClass('h-7')
    })

    it('lg 尺寸应该有正确的高度', () => {
      const { container } = render(<Text size='lg' className='test-size' />)
      expect(container.querySelector('.test-size')).toHaveClass('h-10')
    })
  })

  describe('边框 (border)', () => {
    it('默认应该有边框', () => {
      const { container } = render(<Text className='test-border' />)
      expect(container.querySelector('.test-border')).toHaveClass('border')
    })

    it('border 为 false 时不应该有边框类名', () => {
      const { container } = render(
        <Text border={false} className='test-border' />
      )
      expect(container.querySelector('.test-border')).not.toHaveClass('border')
    })
  })

  describe('最大长度 (max)', () => {
    it('超过最大长度应该截断', () => {
      const onChange = vi.fn()
      render(<Text value='' max={5} onChange={onChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '1234567890' } })
      expect(onChange).toHaveBeenCalledWith('12345')
    })

    it('未超过最大长度应该正常输入', () => {
      const onChange = vi.fn()
      render(<Text value='' max={10} onChange={onChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '12345' } })
      expect(onChange).toHaveBeenCalledWith('12345')
    })
  })

  describe('前后插槽 (before/after)', () => {
    it('应该渲染 before 插槽', () => {
      render(<Text before={<span>前缀</span>} />)
      expect(screen.getByText('前缀')).toBeInTheDocument()
    })

    it('应该渲染 after 插槽', () => {
      render(<Text after={<span>后缀</span>} />)
      expect(screen.getByText('后缀')).toBeInTheDocument()
    })
  })

  describe('HTML 类型 (htmlType)', () => {
    it('应该支持 email 类型', () => {
      render(<Text htmlType='email' />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })
  })

  describe('焦点状态', () => {
    it('聚焦时应该有焦点样式', () => {
      const { container } = render(<Text />)
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      // 检查是否有 focus 相关的样式类
      expect(container.firstChild).toBeInTheDocument()
    })

    it('失焦时应该触发 onBlur', () => {
      const onBlur = vi.fn()
      render(<Text onBlur={onBlur} />)
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      fireEvent.blur(input)
      expect(onBlur).toHaveBeenCalled()
    })
  })

  describe('键盘事件', () => {
    it('应该支持 onKeyDown', () => {
      const onKeyDown = vi.fn()
      render(<Text onKeyDown={onKeyDown} />)
      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(onKeyDown).toHaveBeenCalled()
    })

    it('应该支持 onKeyUp', () => {
      const onKeyUp = vi.fn()
      render(<Text onKeyUp={onKeyUp} />)
      const input = screen.getByRole('textbox')
      fireEvent.keyUp(input, { key: 'Enter' })
      expect(onKeyUp).toHaveBeenCalled()
    })
  })

  describe('组合场景', () => {
    it('带前后缀的禁用输入框应该正确渲染', () => {
      const { container } = render(
        <Text disabled before={<span>$</span>} after={<span>.00</span>} />
      )
      expect(screen.getByText('$')).toBeInTheDocument()
      expect(screen.getByText('.00')).toBeInTheDocument()
      expect(container.querySelector('.cursor-not-allowed')).toBeInTheDocument()
    })

    it('大尺寸无边框输入框应该正确渲染', () => {
      const { container } = render(
        <Text size='lg' border={false} className='test-combined' />
      )
      expect(container.querySelector('.test-combined')).toHaveClass('h-10')
      expect(container.querySelector('.test-combined')).not.toHaveClass(
        'border'
      )
    })
  })
})
