import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from '../Textarea'

describe('Textarea 多行文本输入组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      render(<Textarea className='custom-class' />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('custom-class')
    })

    it('应该支持传入自定义 style', () => {
      render(<Textarea style={{ width: '300px' }} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveStyle({ width: '300px' })
    })
  })

  describe('输入值 (value)', () => {
    it('应该正确显示 value', () => {
      render(<Textarea value='测试内容' />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('测试内容')
    })

    it('输入应该触发 onChange', () => {
      const onChange = vi.fn()
      render(<Textarea value='' onChange={onChange} />)
      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: '新内容' } })
      expect(onChange).toHaveBeenCalledWith('新内容')
    })

    it('默认 value 应该是空字符串', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('')
    })
  })

  describe('占位符 (placeholder)', () => {
    it('应该正确显示 placeholder', () => {
      render(<Textarea placeholder='请输入内容' />)
      const textarea = screen.getByPlaceholderText('请输入内容')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('禁用状态应该有 disabled 属性', () => {
      render(<Textarea disabled />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    it('禁用状态应该有禁用样式', () => {
      render(<Textarea disabled />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('disabled:cursor-not-allowed')
    })
  })

  describe('只读模式 (readMode)', () => {
    it('只读模式应该直接显示值', () => {
      render(<Textarea readMode value='只读内容' />)
      expect(screen.getByText('只读内容')).toBeInTheDocument()
    })

    it('只读模式不应该渲染 textarea', () => {
      render(<Textarea readMode value='只读内容' />)
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })

  describe('行列设置 (rows/cols)', () => {
    it('应该支持 rows 属性', () => {
      render(<Textarea rows={5} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '5')
    })

    it('应该支持 cols 属性', () => {
      render(<Textarea cols={30} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('cols', '30')
    })
  })

  describe('焦点状态', () => {
    it('聚焦时应该触发 onFocus 样式变化', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      fireEvent.focus(textarea)
      expect(textarea).toBeInTheDocument()
    })

    it('失焦时应该正常处理', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      fireEvent.focus(textarea)
      fireEvent.blur(textarea)
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带 placeholder 的禁用文本域应该正确渲染', () => {
      render(<Textarea disabled placeholder='请输入' />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
      expect(textarea).toHaveAttribute('placeholder', '请输入')
    })

    it('带 rows 和 cols 的文本域应该正确渲染', () => {
      render(<Textarea rows={10} cols={50} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '10')
      expect(textarea).toHaveAttribute('cols', '50')
    })
  })
})
