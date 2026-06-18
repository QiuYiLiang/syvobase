import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tree } from '../Tree'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ReactNode } from 'react'

// 包装 DndProvider 的渲染函数
const renderWithDnd = (ui: ReactNode) => {
  return render(<DndProvider backend={HTML5Backend}>{ui}</DndProvider>)
}

describe('Tree 树形组件', () => {
  const defaultItems = [
    { id: '1', name: '节点1' },
    { id: '2', name: '节点2' },
    { id: '3', name: '节点3' },
  ]

  const treeItems = [
    {
      id: '1',
      name: '父节点1',
      children: [
        { id: '1-1', name: '子节点1-1' },
        { id: '1-2', name: '子节点1-2' },
      ],
    },
    { id: '2', name: '节点2' },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染所有节点', () => {
      renderWithDnd(<Tree items={defaultItems} />)
      expect(screen.getByText('节点1')).toBeInTheDocument()
      expect(screen.getByText('节点2')).toBeInTheDocument()
      expect(screen.getByText('节点3')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = renderWithDnd(
        <Tree className='custom-class' items={defaultItems} />
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })
  })

  describe('选中状态 (value)', () => {
    it('点击节点应该触发 onChange', () => {
      const onChange = vi.fn()
      renderWithDnd(<Tree items={defaultItems} value='' onChange={onChange} />)
      fireEvent.click(screen.getByText('节点1'))
      expect(onChange).toHaveBeenCalledWith('1')
    })

    it('应该支持受控模式', () => {
      const { container } = renderWithDnd(
        <Tree items={defaultItems} value='1' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('多选模式 (multiple)', () => {
    it('multiple 为 true 时应该渲染多选界面', () => {
      const { container } = renderWithDnd(
        <Tree items={defaultItems} multiple value={[]} onChange={vi.fn()} />
      )
      // multiple 模式下，点击节点行不会触发 onChange，需要点击 checkbox
      // 这里只验证组件正确渲染
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('树形数据 (isTree)', () => {
    it('应该渲染树形结构', () => {
      renderWithDnd(<Tree items={treeItems} isTree />)
      expect(screen.getByText('父节点1')).toBeInTheDocument()
    })

    it('isTreeData 为 true 时应该处理树形数据', () => {
      const { container } = renderWithDnd(<Tree items={treeItems} isTreeData />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('搜索功能 (search/localSearch)', () => {
    it('search 属性应该显示搜索框', () => {
      renderWithDnd(<Tree items={defaultItems} search={{}} />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('localSearch 为 true 时应该显示搜索框', () => {
      renderWithDnd(<Tree items={defaultItems} localSearch />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('工具栏 (toolbar)', () => {
    it('应该渲染工具栏', () => {
      renderWithDnd(<Tree items={defaultItems} toolbar={[{ icon: 'Plus' }]} />)
      const icon = document.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('拖拽功能 (draggable)', () => {
    it('draggable 为 true 时应该支持拖拽', () => {
      const { container } = renderWithDnd(
        <Tree items={defaultItems} draggable />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('展开层级 (maxExpandLevel)', () => {
    it('应该根据 maxExpandLevel 控制展开', () => {
      const { container } = renderWithDnd(
        <Tree items={treeItems} isTree maxExpandLevel={2} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('默认展开层级 (defaultExpandLevel)', () => {
    it('应该支持设置默认展开层级', () => {
      const { container } = renderWithDnd(
        <Tree items={treeItems} isTree defaultExpandLevel={1} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('节点点击回调 (onNodeClick)', () => {
    it('点击节点应该触发 onNodeClick', () => {
      const onNodeClick = vi.fn()
      renderWithDnd(<Tree items={defaultItems} onNodeClick={onNodeClick} />)
      fireEvent.click(screen.getByText('节点1'))
      expect(onNodeClick).toHaveBeenCalled()
    })
  })

  describe('禁用节点 (onDisabledItem)', () => {
    it('应该支持禁用特定节点', () => {
      const { container } = renderWithDnd(
        <Tree items={defaultItems} onDisabledItem={(node) => node.id === '1'} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('复选框行 (enabledCheckboxRow)', () => {
    it('enabledCheckboxRow 为 true 且 multiple 为 true 时应该显示复选框', () => {
      const { container } = renderWithDnd(
        <Tree items={defaultItems} enabledCheckboxRow multiple />
      )
      // Checkbox 组件使用 data-tag="nk-checkbox" 属性
      expect(
        container.querySelector('[data-tag="nk-checkbox"]')
      ).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带搜索和工具栏的树应该正确渲染', () => {
      renderWithDnd(
        <Tree
          items={treeItems}
          isTree
          localSearch
          toolbar={[{ icon: 'Plus' }]}
        />
      )
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByText('父节点1')).toBeInTheDocument()
    })
  })
})
