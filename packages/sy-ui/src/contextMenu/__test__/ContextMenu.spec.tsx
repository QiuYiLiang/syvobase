import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContextMenu } from '../ContextMenu'

describe('ContextMenu 右键菜单组件', () => {
  const defaultItems = [
    { name: '菜单1', onClick: vi.fn() },
    { name: '菜单2', onClick: vi.fn() },
    { name: '菜单3', onClick: vi.fn() },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染触发元素', () => {
      render(
        <ContextMenu items={defaultItems}>
          <div>右键点击我</div>
        </ContextMenu>
      )
      expect(screen.getByText('右键点击我')).toBeInTheDocument()
    })
  })

  describe('右键触发', () => {
    it('右键点击应该显示菜单', async () => {
      render(
        <ContextMenu items={defaultItems}>
          <div>右键点击我</div>
        </ContextMenu>
      )
      const trigger = screen.getByText('右键点击我')
      fireEvent.contextMenu(trigger)
      await waitFor(() => {
        expect(screen.getByText('菜单1')).toBeInTheDocument()
      })
    })
  })

  describe('菜单项类型', () => {
    it('应该渲染普通菜单项', async () => {
      render(
        <ContextMenu items={defaultItems}>
          <div>触发</div>
        </ContextMenu>
      )
      fireEvent.contextMenu(screen.getByText('触发'))
      await waitFor(() => {
        expect(screen.getByText('菜单1')).toBeInTheDocument()
        expect(screen.getByText('菜单2')).toBeInTheDocument()
        expect(screen.getByText('菜单3')).toBeInTheDocument()
      })
    })

    it('应该渲染分隔线', async () => {
      const items = [
        { name: '菜单1' },
        { type: 'separator' as const },
        { name: '菜单2' },
      ]
      render(
        <ContextMenu items={items}>
          <div>触发</div>
        </ContextMenu>
      )
      fireEvent.contextMenu(screen.getByText('触发'))
      await waitFor(() => {
        const separator = document.querySelector('.bg-border.h-px')
        expect(separator).toBeInTheDocument()
      })
    })

    it('应该渲染标签项', async () => {
      const items = [
        { type: 'label' as const, name: '分组标题' },
        { name: '菜单1' },
      ]
      render(
        <ContextMenu items={items}>
          <div>触发</div>
        </ContextMenu>
      )
      fireEvent.contextMenu(screen.getByText('触发'))
      await waitFor(() => {
        expect(screen.getByText('分组标题')).toBeInTheDocument()
      })
    })
  })

  describe('菜单项点击', () => {
    it('点击菜单项应该触发 onClick', async () => {
      const onClick = vi.fn()
      const items = [{ name: '可点击菜单', onClick }]
      render(
        <ContextMenu items={items}>
          <div>触发</div>
        </ContextMenu>
      )
      fireEvent.contextMenu(screen.getByText('触发'))
      await waitFor(() => {
        fireEvent.click(screen.getByText('可点击菜单'))
      })
      expect(onClick).toHaveBeenCalled()
    })
  })

  describe('子菜单', () => {
    it('应该渲染子菜单', async () => {
      const items = [
        {
          name: '父菜单',
          items: [{ name: '子菜单1' }, { name: '子菜单2' }],
        },
      ]
      render(
        <ContextMenu items={items}>
          <div>触发</div>
        </ContextMenu>
      )
      fireEvent.contextMenu(screen.getByText('触发'))
      await waitFor(() => {
        expect(screen.getByText('父菜单')).toBeInTheDocument()
      })
    })
  })

  describe('图标', () => {
    it('带图标的菜单项应该显示图标', async () => {
      const items = [{ name: '带图标菜单', icon: 'Settings' as const }]
      render(
        <ContextMenu items={items}>
          <div>触发</div>
        </ContextMenu>
      )
      fireEvent.contextMenu(screen.getByText('触发'))
      await waitFor(() => {
        const icon = document.querySelector('svg')
        expect(icon).toBeInTheDocument()
      })
    })
  })

  describe('菜单项可见性 (visible)', () => {
    it('visible 返回 false 时不应该显示菜单项', async () => {
      const items = [
        { name: '显示的菜单', visible: () => true },
        { name: '隐藏的菜单', visible: () => false },
      ]
      render(
        <ContextMenu items={items}>
          <div>触发</div>
        </ContextMenu>
      )
      fireEvent.contextMenu(screen.getByText('触发'))
      await waitFor(() => {
        expect(screen.getByText('显示的菜单')).toBeInTheDocument()
        expect(screen.queryByText('隐藏的菜单')).not.toBeInTheDocument()
      })
    })
  })

  describe('组合场景', () => {
    it('带图标和子菜单的复杂菜单应该正确渲染', async () => {
      const items = [
        { name: '普通菜单', icon: 'Home' as const },
        { type: 'separator' as const },
        { type: 'label' as const, name: '分组' },
        {
          name: '子菜单',
          items: [{ name: '子项1' }],
        },
      ]
      render(
        <ContextMenu items={items}>
          <div>复杂菜单</div>
        </ContextMenu>
      )
      fireEvent.contextMenu(screen.getByText('复杂菜单'))
      await waitFor(() => {
        expect(screen.getByText('普通菜单')).toBeInTheDocument()
        expect(screen.getByText('分组')).toBeInTheDocument()
        expect(screen.getByText('子菜单')).toBeInTheDocument()
      })
    })
  })
})
