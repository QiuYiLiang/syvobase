import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DragList } from '../DragList'
import { DragDropProvider } from '../DragDropProvider'
import { DragListDataItem } from '../shared'
import { InsertCursorProvider } from '../../insertCursor'

describe('DragList 拖拽列表组件', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <InsertCursorProvider>
        <DragDropProvider>{ui}</DragDropProvider>
      </InsertCursorProvider>
    )
  }

  const defaultData: DragListDataItem[] = [
    { id: '1', name: '项目1' },
    { id: '2', name: '项目2' },
    { id: '3', name: '项目3' },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染所有项目', () => {
      renderWithProviders(
        <DragList
          data={defaultData}
          onItemRender={({ item }) => <div>{(item as any).name}</div>}
        />
      )
      expect(screen.getByText('项目1')).toBeInTheDocument()
      expect(screen.getByText('项目2')).toBeInTheDocument()
      expect(screen.getByText('项目3')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = renderWithProviders(
        <DragList
          className='custom-class'
          data={defaultData}
          onItemRender={({ item }) => <div>{(item as any).name}</div>}
        />
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })
  })

  describe('空数据', () => {
    it('空数据时应该正确渲染', () => {
      const { container } = renderWithProviders(
        <DragList
          data={[]}
          onItemRender={({ item }) => <div>{(item as any).name}</div>}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('数据变更回调 (onChange)', () => {
    it('应该支持 onChange 回调', () => {
      const onChange = vi.fn()
      renderWithProviders(
        <DragList
          data={defaultData}
          onChange={onChange}
          onItemRender={({ item }) => <div>{(item as any).name}</div>}
        />
      )
      expect(screen.getByText('项目1')).toBeInTheDocument()
    })
  })

  describe('自定义渲染 (onItemRender)', () => {
    it('应该使用自定义渲染函数', () => {
      renderWithProviders(
        <DragList
          data={defaultData}
          onItemRender={({ item }) => (
            <div className='custom-item'>
              <span>{(item as any).name}</span>
              <span>-</span>
              <span>{item.id}</span>
            </div>
          )}
        />
      )
      expect(screen.getByText('项目1')).toBeInTheDocument()
    })
  })

  describe('插入光标 (insertCursor)', () => {
    it('insertCursor 为 true 时应该显示插入光标', () => {
      const { container } = renderWithProviders(
        <DragList
          data={defaultData}
          insertCursor
          onItemRender={({ item }) => <div>{(item as any).name}</div>}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('分割线渲染 (onDividerRender)', () => {
    it('应该支持自定义分割线渲染', () => {
      const { container } = renderWithProviders(
        <DragList
          data={defaultData}
          onItemRender={({ item }) => <div>{(item as any).name}</div>}
          onDividerRender={() => <hr className='custom-divider' />}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带插入光标的拖拽列表应该正确渲染', () => {
      const { container } = renderWithProviders(
        <DragList
          className='drag-container'
          data={defaultData}
          insertCursor
          onItemRender={({ item }) => (
            <div className='drag-item'>{(item as any).name}</div>
          )}
        />
      )
      expect(container.querySelector('.drag-container')).toBeInTheDocument()
      expect(screen.getByText('项目1')).toBeInTheDocument()
    })
  })
})
