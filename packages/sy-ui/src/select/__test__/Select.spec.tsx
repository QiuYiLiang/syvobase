import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '../Select'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const renderWithDnd = (ui: React.ReactElement) => {
  return render(<DndProvider backend={HTML5Backend}>{ui}</DndProvider>)
}

describe('Select 选择器组件', () => {
  const defaultItems = [
    { id: '1', name: '选项1' },
    { id: '2', name: '选项2' },
    { id: '3', name: '选项3' },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = renderWithDnd(<Select items={defaultItems} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = renderWithDnd(
        <Select className='custom-class' items={defaultItems} />
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该显示 placeholder', () => {
      renderWithDnd(<Select items={defaultItems} placeholder='请选择' />)
      expect(screen.getByText('请选择')).toBeInTheDocument()
    })
  })

  describe('选择功能', () => {
    it('应该显示选中的值', () => {
      renderWithDnd(<Select items={defaultItems} value='2' />)
      expect(screen.getByText('选项2')).toBeInTheDocument()
    })
  })

  describe('多选模式 (multiple)', () => {
    it('多选模式应该显示标签', () => {
      renderWithDnd(<Select items={defaultItems} multiple value={['1', '2']} />)
      expect(screen.getByText('选项1')).toBeInTheDocument()
      expect(screen.getByText('选项2')).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('禁用状态应该有禁用样式', () => {
      const { container } = renderWithDnd(
        <Select items={defaultItems} disabled />
      )
      const cursor = container.querySelector('.cursor-not-allowed')
      expect(cursor).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('只读模式应该直接显示值', () => {
      renderWithDnd(<Select items={defaultItems} readMode value='1' />)
      expect(screen.getByText('选项1')).toBeInTheDocument()
    })
  })

  describe('尺寸 (size)', () => {
    it('默认尺寸应该正常渲染', () => {
      const { container } = renderWithDnd(
        <Select items={defaultItems} size='default' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('sm 尺寸应该正常渲染', () => {
      const { container } = renderWithDnd(
        <Select items={defaultItems} size='sm' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('lg 尺寸应该正常渲染', () => {
      const { container } = renderWithDnd(
        <Select items={defaultItems} size='lg' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('清除功能 (allowClear)', () => {
    it('allowClear 为 true 时应该可以清除', async () => {
      const onChange = vi.fn()
      const { container } = renderWithDnd(
        <Select items={defaultItems} value='1' allowClear onChange={onChange} />
      )

      // 鼠标进入触发清除按钮显示
      const selectContainer = container.querySelector('[data-tag="nk-select"]')
      expect(selectContainer).toBeTruthy()

      // 触发显示清除按钮
      fireEvent.mouseEnter(selectContainer as Element)

      // 清除按钮应该出现并可点击
      const clearBtn = container.querySelector('svg')
      expect(clearBtn).toBeTruthy()

      // 点击清除
      fireEvent.click(clearBtn as Element)

      // 断言 onChange 被调用，值被清空
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('树形选择 (isTree)', () => {
    it('isTree 为 true 时应该支持树形结构', () => {
      const treeItems = [
        { id: '1', name: '父节点', children: [{ id: '1-1', name: '子节点' }] },
      ]
      const { container } = renderWithDnd(
        <Select items={treeItems} isTree isTreeData />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('高度限制', () => {
    it('应该支持 minHeight', () => {
      const { container } = renderWithDnd(
        <Select items={defaultItems} minHeight={100} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持 maxHeight', () => {
      const { container } = renderWithDnd(
        <Select items={defaultItems} maxHeight={200} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('自定义字段名 (fieldNames)', () => {
    it('应该支持自定义字段名', () => {
      const customItems = [
        { value: 'a', label: 'A选项' },
        { value: 'b', label: 'B选项' },
      ]
      const { container } = renderWithDnd(
        <Select
          items={customItems}
          fieldNames={{ idKey: 'value', nameKey: 'label' }}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('多选带清除的选择器应该正确渲染', () => {
      renderWithDnd(
        <Select items={defaultItems} multiple allowClear value={['1', '2']} />
      )
      expect(screen.getByText('选项1')).toBeInTheDocument()
      expect(screen.getByText('选项2')).toBeInTheDocument()
    })

    it('禁用的带值选择器应该正确渲染', () => {
      renderWithDnd(<Select items={defaultItems} disabled value='1' />)
      expect(screen.getByText('选项1')).toBeInTheDocument()
    })
  })
})
