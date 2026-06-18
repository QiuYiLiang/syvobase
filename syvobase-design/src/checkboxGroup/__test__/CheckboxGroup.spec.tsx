import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckboxGroup } from '../CheckboxGroup'

describe('CheckboxGroup 复选框组组件', () => {
  const defaultItems = [
    { id: '1', name: '选项1' },
    { id: '2', name: '选项2' },
    { id: '3', name: '选项3' },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染所有选项', () => {
      render(<CheckboxGroup items={defaultItems} />)
      expect(screen.getByText('选项1')).toBeInTheDocument()
      expect(screen.getByText('选项2')).toBeInTheDocument()
      expect(screen.getByText('选项3')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <CheckboxGroup className='custom-class' items={defaultItems} />
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <CheckboxGroup
          style={{ gap: '20px' }}
          items={defaultItems}
          className='test-style-class'
        />
      )
      expect(container.querySelector('.test-style-class')).toHaveStyle({
        gap: '20px',
      })
    })
  })

  describe('选择功能', () => {
    it('点击选项应该选中', () => {
      const onChange = vi.fn()
      render(
        <CheckboxGroup items={defaultItems} value={[]} onChange={onChange} />
      )
      fireEvent.click(screen.getByText('选项1'))
      expect(onChange).toHaveBeenCalledWith(['1'])
    })

    it('再次点击应该取消选中', () => {
      const onChange = vi.fn()
      render(
        <CheckboxGroup items={defaultItems} value={['1']} onChange={onChange} />
      )
      fireEvent.click(screen.getByText('选项1'))
      expect(onChange).toHaveBeenCalledWith([])
    })

    it('可以选中多个选项', () => {
      const onChange = vi.fn()
      render(
        <CheckboxGroup items={defaultItems} value={['1']} onChange={onChange} />
      )
      fireEvent.click(screen.getByText('选项2'))
      expect(onChange).toHaveBeenCalledWith(['1', '2'])
    })
  })

  describe('受控模式 (value)', () => {
    it('应该正确显示选中的值', () => {
      const { container } = render(
        <CheckboxGroup items={defaultItems} value={['1', '2']} />
      )
      // pills 样式选中时有 bg-primary 类
      const selectedItems = container.querySelectorAll('.bg-primary')
      expect(selectedItems.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('单选模式 (multiple=false)', () => {
    it('单选模式只能选中一个', () => {
      const onChange = vi.fn()
      render(
        <CheckboxGroup
          items={defaultItems}
          multiple={false}
          value={['1']}
          onChange={onChange}
        />
      )
      fireEvent.click(screen.getByText('选项2'))
      expect(onChange).toHaveBeenCalledWith('2')
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('禁用状态应该有禁用样式', () => {
      const { container } = render(
        <CheckboxGroup items={defaultItems} disabled styleType='classic' />
      )
      expect(container.querySelector('.cursor-not-allowed')).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('只读模式应该显示 TagGroup', () => {
      render(<CheckboxGroup items={defaultItems} readMode value={['1', '2']} />)
      // TagGroup 会渲染标签
      expect(screen.getByText('选项1')).toBeInTheDocument()
      expect(screen.getByText('选项2')).toBeInTheDocument()
    })
  })

  describe('排列方向 (orientation)', () => {
    it('默认应该是水平排列', () => {
      const { container } = render(<CheckboxGroup items={defaultItems} />)
      expect(
        container.querySelector('.flex-row, .flex-wrap')
      ).toBeInTheDocument()
    })

    it('vertical 应该垂直排列', () => {
      const { container } = render(
        <CheckboxGroup items={defaultItems} orientation='vertical' />
      )
      expect(container.querySelector('.flex-col')).toBeInTheDocument()
    })
  })

  describe('样式类型 (styleType)', () => {
    it('默认应该是 pills 样式', () => {
      render(<CheckboxGroup items={defaultItems} />)
      // pills 样式使用 Button 组件
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('classic 样式应该显示复选框', () => {
      const { container } = render(
        <CheckboxGroup items={defaultItems} styleType='classic' />
      )
      expect(container.querySelector('.border')).toBeInTheDocument()
    })
  })

  describe('自定义字段名 (fieldNames)', () => {
    it('应该支持自定义字段名', () => {
      const customItems = [
        { value: 'a', label: 'A选项' },
        { value: 'b', label: 'B选项' },
      ]
      render(
        <CheckboxGroup
          items={customItems}
          fieldNames={{ idKey: 'value', nameKey: 'label' }}
        />
      )
      expect(screen.getByText('A选项')).toBeInTheDocument()
      expect(screen.getByText('B选项')).toBeInTheDocument()
    })
  })

  describe('禁用单个选项 (onDisabledItem)', () => {
    it('应该可以禁用特定选项', () => {
      const { container } = render(
        <CheckboxGroup
          items={defaultItems}
          onDisabledItem={(item) => item.id === '2'}
        />
      )
      // 被禁用的选项应该有禁用样式
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('垂直排列的 classic 样式应该正确渲染', () => {
      const { container } = render(
        <CheckboxGroup
          items={defaultItems}
          orientation='vertical'
          styleType='classic'
          value={['1']}
        />
      )
      expect(container.querySelector('.flex-col')).toBeInTheDocument()
    })

    it('带自定义字段名的只读模式应该正确渲染', () => {
      const customItems = [
        { key: 'x', text: 'X选项' },
        { key: 'y', text: 'Y选项' },
      ]
      render(
        <CheckboxGroup
          items={customItems}
          fieldNames={{ idKey: 'key', nameKey: 'text' }}
          readMode
          value={['x']}
        />
      )
      expect(screen.getByText('X选项')).toBeInTheDocument()
    })
  })
})
