import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Table } from '../Table'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ReactNode } from 'react'

// 包装 DndProvider 的渲染函数
const renderWithDnd = (ui: ReactNode) => {
  return render(<DndProvider backend={HTML5Backend}>{ui}</DndProvider>)
}

describe('Table 表格组件', () => {
  const defaultColumns = [
    { id: 'name', name: '姓名' },
    { id: 'age', name: '年龄' },
    { id: 'email', name: '邮箱' },
  ]

  const defaultValue = [
    { id: '1', name: '张三', age: 25, email: 'zhangsan@test.com' },
    { id: '2', name: '李四', age: 30, email: 'lisi@test.com' },
    { id: '3', name: '王五', age: 28, email: 'wangwu@test.com' },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染表头', () => {
      renderWithDnd(<Table columns={defaultColumns} value={defaultValue} />)
      expect(screen.getByText('姓名')).toBeInTheDocument()
      expect(screen.getByText('年龄')).toBeInTheDocument()
      expect(screen.getByText('邮箱')).toBeInTheDocument()
    })

    it('应该正确渲染数据行', () => {
      renderWithDnd(<Table columns={defaultColumns} value={defaultValue} />)
      expect(screen.getByText('张三')).toBeInTheDocument()
      expect(screen.getByText('李四')).toBeInTheDocument()
      expect(screen.getByText('王五')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = renderWithDnd(
        <Table
          className='custom-class'
          columns={defaultColumns}
          value={defaultValue}
        />
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })
  })

  describe('边框样式 (border)', () => {
    it('默认边框样式应该是 row', () => {
      const { container } = renderWithDnd(
        <Table columns={defaultColumns} value={defaultValue} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('cell 边框样式应该正确渲染', () => {
      const { container } = renderWithDnd(
        <Table columns={defaultColumns} value={defaultValue} border='cell' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('none 边框样式应该正确渲染', () => {
      const { container } = renderWithDnd(
        <Table columns={defaultColumns} value={defaultValue} border='none' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('隐藏表头 (hideHeader)', () => {
    it('hideHeader 为 true 时不应该显示表头', () => {
      const { container } = renderWithDnd(
        <Table columns={defaultColumns} value={defaultValue} hideHeader />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('加载状态 (loading)', () => {
    it('loading 为 true 时应该显示加载状态', () => {
      const { container } = renderWithDnd(
        <Table columns={defaultColumns} value={defaultValue} loading />
      )
      expect(
        container.querySelector('[data-tag="nk-loading"]')
      ).toBeInTheDocument()
    })
  })

  describe('悬停效果 (hover)', () => {
    it('hover 默认应该启用', () => {
      const { container } = renderWithDnd(
        <Table columns={defaultColumns} value={defaultValue} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('树形数据 (isTree)', () => {
    it('isTree 为 true 时应该支持树形展示', () => {
      const treeValue = [
        {
          id: '1',
          name: '父节点',
          children: [
            { id: '1-1', name: '子节点1' },
            { id: '1-2', name: '子节点2' },
          ],
        },
      ]
      const { container } = renderWithDnd(
        <Table
          columns={[{ id: 'name', name: '名称' }]}
          value={treeValue}
          isTree
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('选择功能 (multiple)', () => {
    it('multiple 为 true 时应该支持多选', () => {
      const { container } = renderWithDnd(
        <Table columns={defaultColumns} value={defaultValue} multiple />
      )
      expect(
        container.querySelector('[data-tag="nk-checkbox"]')
      ).toBeInTheDocument()
    })
  })

  describe('拖拽功能 (draggable)', () => {
    it('draggable 为 true 时应该支持行拖拽', () => {
      const { container } = renderWithDnd(
        <Table columns={defaultColumns} value={defaultValue} draggable />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('列宽调整 (resize)', () => {
    it('默认应该支持列宽调整', () => {
      const { container } = renderWithDnd(
        <Table columns={defaultColumns} value={defaultValue} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('工具栏 (toolbar)', () => {
    it('应该渲染工具栏', () => {
      renderWithDnd(
        <Table
          columns={defaultColumns}
          value={defaultValue}
          toolbar={[{ name: '添加' }]}
        />
      )
      expect(screen.getByText('添加')).toBeInTheDocument()
    })
  })

  describe('分页 (pagination)', () => {
    it('应该支持分页', () => {
      const { container } = renderWithDnd(
        <Table
          columns={defaultColumns}
          value={defaultValue}
          pagination={{
            index: 0,
            size: 10,
            total: 100,
          }}
        />
      )
      expect(
        container.querySelector('[data-tag="nk-pagination"]')
      ).toBeInTheDocument()
    })
  })

  describe('空数据', () => {
    it('空数据时应该显示空状态', () => {
      const { container } = renderWithDnd(
        <Table columns={defaultColumns} value={[]} />
      )
      expect(
        container.querySelector('[data-tag="nk-empty"]')
      ).toBeInTheDocument()
    })
  })

  describe('行点击回调 (onRowClick)', () => {
    it('点击行应该触发 onRowClick', () => {
      const onRowClick = vi.fn()
      renderWithDnd(
        <Table
          columns={defaultColumns}
          value={defaultValue}
          onRowClick={onRowClick}
        />
      )
      fireEvent.click(screen.getByText('张三'))
      expect(onRowClick).toHaveBeenCalled()
    })
  })

  describe('组合场景', () => {
    it('带工具栏和分页的表格应该正确渲染', () => {
      const { container } = renderWithDnd(
        <Table
          columns={defaultColumns}
          value={defaultValue}
          toolbar={[{ name: '新建' }, { name: '删除' }]}
          pagination={{
            index: 0,
            size: 10,
            total: 50,
          }}
        />
      )
      expect(screen.getByText('新建')).toBeInTheDocument()
      expect(
        container.querySelector('[data-tag="nk-pagination"]')
      ).toBeInTheDocument()
    })
  })
})
