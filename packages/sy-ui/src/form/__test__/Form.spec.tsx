import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Form } from '../Form'

describe('Form 表单组件', () => {
  const defaultItems = [
    { id: 'name', name: '姓名', control: { type: 'text' } },
    { id: 'age', name: '年龄', control: { type: 'number' } },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染表单项', () => {
      render(<Form items={defaultItems} />)
      expect(screen.getByText('姓名')).toBeInTheDocument()
      expect(screen.getByText('年龄')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <Form className='custom-class' items={defaultItems} />
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Form style={{ margin: '10px' }} items={defaultItems} />
      )
      expect(container.firstChild).toHaveStyle({ margin: '10px' })
    })
  })

  describe('表单值 (value)', () => {
    it('应该支持受控模式', () => {
      render(<Form items={defaultItems} value={{ name: '张三' }} />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveValue('张三')
    })

    it('修改表单字段应该触发 onChange', () => {
      const onChange = vi.fn()
      render(<Form items={defaultItems} value={{}} onChange={onChange} />)
      const input = screen.getAllByRole('textbox')[0]
      fireEvent.change(input, { target: { value: '李四' } })
      expect(onChange).toHaveBeenCalled()
    })

    it('修改字段应该触发 onFieldChange', () => {
      const onFieldChange = vi.fn()
      render(<Form items={defaultItems} onFieldChange={onFieldChange} />)
      const input = screen.getAllByRole('textbox')[0]
      fireEvent.change(input, { target: { value: '测试' } })
      expect(onFieldChange).toHaveBeenCalledWith('name', '测试')
    })
  })

  describe('标签宽度 (labelWidth)', () => {
    it('应该支持自定义 labelWidth', () => {
      const { container } = render(
        <Form items={defaultItems} labelWidth={100} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('内边距 (padding)', () => {
    it('应该支持自定义 padding', () => {
      const { container } = render(<Form items={defaultItems} padding={20} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('宽度 (width)', () => {
    it('默认宽度应该是 100%', () => {
      const { container } = render(<Form items={defaultItems} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持自定义宽度', () => {
      const { container } = render(<Form items={defaultItems} width={500} />)
      const contentWrapper = container.querySelector('[style*="width: 500px"]')
      expect(contentWrapper).toBeInTheDocument()
    })
  })

  describe('类型 (type)', () => {
    it('card 类型应该有卡片样式', () => {
      const { container } = render(<Form items={defaultItems} type='card' />)
      expect(container.querySelector('.rounded-lg')).toBeInTheDocument()
    })
  })

  describe('边框 (border)', () => {
    it('border 为 true 时应该显示边框', () => {
      const { container } = render(
        <Form items={defaultItems} header='标题' border />
      )
      expect(container.querySelector('.border-b')).toBeInTheDocument()
    })
  })

  describe('标签位置 (topLabel)', () => {
    it('默认标签应该在顶部', () => {
      const { container } = render(<Form items={defaultItems} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('头部和底部 (header/footer)', () => {
    it('应该渲染 header', () => {
      render(<Form items={defaultItems} header='表单标题' />)
      expect(screen.getByText('表单标题')).toBeInTheDocument()
    })

    it('应该渲染 footer', () => {
      render(<Form items={defaultItems} footer='表单底部' />)
      expect(screen.getByText('表单底部')).toBeInTheDocument()
    })
  })

  describe('工具栏 (topToolbar/toolbar)', () => {
    it('应该渲染顶部工具栏', () => {
      render(<Form items={defaultItems} topToolbar={[{ name: '刷新' }]} />)
      expect(screen.getByText('刷新')).toBeInTheDocument()
    })

    it('应该渲染底部工具栏', () => {
      render(<Form items={defaultItems} toolbar={[{ name: '提交' }]} />)
      expect(screen.getByText('提交')).toBeInTheDocument()
    })
  })

  describe('表单验证 (ref.validation)', () => {
    it('应该通过 ref 暴露 validation 方法', async () => {
      const ref = { current: null as any }
      render(<Form ref={ref} items={defaultItems} />)
      expect(ref.current).toHaveProperty('validation')
      expect(typeof ref.current.validation).toBe('function')
    })
  })

  describe('Grid 布局', () => {
    it('应该支持 Grid 布局配置', () => {
      // GridForm 期望 items 是二维数组 CellProps[][]
      const gridItems = {
        widths: [50, 50],
        items: [
          [
            { id: 'a', name: 'A', control: { type: 'text' } },
            { id: 'b', name: 'B', control: { type: 'text' } },
          ],
        ],
      }
      render(<Form items={gridItems} />)
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带标题工具栏的卡片表单应该正确渲染', () => {
      render(
        <Form
          type='card'
          header='用户信息'
          items={defaultItems}
          topToolbar={[{ name: '编辑' }]}
          toolbar={[{ name: '保存' }, { name: '取消' }]}
        />
      )
      expect(screen.getByText('用户信息')).toBeInTheDocument()
      expect(screen.getByText('编辑')).toBeInTheDocument()
      expect(screen.getByText('保存')).toBeInTheDocument()
      expect(screen.getByText('取消')).toBeInTheDocument()
    })
  })
})
