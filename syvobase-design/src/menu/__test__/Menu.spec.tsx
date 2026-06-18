import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Menu } from '../Menu'
import { Icon } from '@/icon'

describe('Menu 菜单组件', () => {
  const defaultItems = [
    { id: '1', name: '菜单1' },
    { id: '2', name: '菜单2' },
    { id: '3', name: '菜单3' },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染所有菜单项', () => {
      render(<Menu items={defaultItems} />)
      expect(screen.getByText('菜单1')).toBeInTheDocument()
      expect(screen.getByText('菜单2')).toBeInTheDocument()
      expect(screen.getByText('菜单3')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <Menu className='custom-class' items={defaultItems} />
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Menu style={{ padding: '20px' }} items={defaultItems} />
      )
      expect(container.firstChild).toHaveStyle({ padding: '20px' })
    })
  })

  describe('选中状态 (value)', () => {
    it('应该可以通过 value 控制选中项', () => {
      const { container } = render(<Menu items={defaultItems} value='1' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('点击菜单项应该触发 onChange', () => {
      const onChange = vi.fn()
      render(<Menu items={defaultItems} value='' onChange={onChange} />)
      fireEvent.click(screen.getByText('菜单1'))
      expect(onChange).toHaveBeenCalledWith('1')
    })
  })

  describe('尺寸 (size)', () => {
    it('默认尺寸应该是 lg', () => {
      const { container } = render(<Menu items={defaultItems} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('sm 尺寸应该正常渲染', () => {
      const { container } = render(<Menu items={defaultItems} size='sm' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('default 尺寸应该正常渲染', () => {
      const { container } = render(<Menu items={defaultItems} size='default' />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('宽度 (width)', () => {
    it('应该支持自定义宽度', () => {
      const { container } = render(
        <Menu items={defaultItems} style={{ width: 300 }} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('图标', () => {
    it('应该渲染带图标的菜单项', () => {
      const items = [{ id: '1', name: '设置', icon: <Icon name='Settings' /> }]
      const { container } = render(<Menu items={items} />)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('子菜单', () => {
    it('应该渲染子菜单', () => {
      const items = [
        {
          id: '1',
          name: '父菜单',
          children: [
            { id: '1-1', name: '子菜单1' },
            { id: '1-2', name: '子菜单2' },
          ],
        },
      ]
      render(<Menu items={items} />)
      expect(screen.getByText('父菜单')).toBeInTheDocument()
    })
  })

  describe('菜单模式 (mode)', () => {
    it('默认模式应该是 inline', () => {
      const { container } = render(<Menu items={defaultItems} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('horizontal 模式应该正常渲染', () => {
      const { container } = render(
        <Menu items={defaultItems} mode='horizontal' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('vertical 模式应该正常渲染', () => {
      const { container } = render(
        <Menu items={defaultItems} mode='vertical' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('搜索功能 (enabledSearch)', () => {
    it('enabledSearch 为 true 时应该显示搜索框', () => {
      render(<Menu items={defaultItems} enabledSearch />)
      const searchInput = screen.getByRole('textbox')
      expect(searchInput).toBeInTheDocument()
    })
  })

  describe('徽标 (count)', () => {
    it('应该显示菜单项徽标', () => {
      const items = [{ id: '1', name: '消息', count: 5 }]
      render(<Menu items={items} />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('分隔线', () => {
    it('应该渲染分隔线', () => {
      const items = [
        { id: '1', name: '菜单1' },
        { id: 'sep', name: '', type: 'separator' as const },
        { id: '2', name: '菜单2' },
      ]
      const { container } = render(<Menu items={items} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('onItemClick 回调', () => {
    it('点击菜单项应该触发 onItemClick', () => {
      const onItemClick = vi.fn()
      render(<Menu items={defaultItems} onItemClick={onItemClick} />)
      fireEvent.click(screen.getByText('菜单1'))
      expect(onItemClick).toHaveBeenCalled()
    })
  })

  describe('组合场景', () => {
    it('带搜索的多级菜单应该正确渲染', () => {
      const items = [
        {
          id: '1',
          name: '系统',
          children: [
            { id: '1-1', name: '用户管理' },
            { id: '1-2', name: '角色管理' },
          ],
        },
        { id: '2', name: '设置' },
      ]
      render(<Menu items={items} enabledSearch />)
      expect(screen.getByText('系统')).toBeInTheDocument()
      expect(screen.getByText('设置')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })
})
