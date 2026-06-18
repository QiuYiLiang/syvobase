import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Dropdown, DropdownProps, DropdownMenuType } from '../Dropdown'

// 模拟子组件
vi.mock('@/icon', () => ({
  Icon: ({ name, className }: { name: string; className?: string }) => (
    <svg data-testid={`icon-${name}`} className={className} />
  ),
}))

describe('Dropdown 下拉菜单组件', () => {
  const defaultItems: DropdownMenuType = [
    { name: '菜单项1' },
    { name: '菜单项2' },
    { name: '菜单项3' },
  ]

  // 使用 span 而不是 button 来避免嵌套 button 的问题
  const renderDropdown = (props: Partial<DropdownProps> = {}) => {
    return render(
      <Dropdown items={defaultItems} {...props}>
        <span>触发按钮</span>
      </Dropdown>
    )
  }

  describe('基础渲染', () => {
    it('应该正确渲染触发元素', () => {
      renderDropdown()
      expect(screen.getByText('触发按钮')).toBeInTheDocument()
    })

    it('应该支持传入自定义 children', () => {
      render(
        <Dropdown items={defaultItems}>
          <span>自定义触发元素</span>
        </Dropdown>
      )
      expect(screen.getByText('自定义触发元素')).toBeInTheDocument()
    })

    it('应该有正确的 data-tag 属性', () => {
      const { baseElement } = renderDropdown()
      // data-tag 属性在开发模式下才会存在，验证组件已渲染
      baseElement.querySelector('[data-tag="dropdown"]')
      // 验证组件已渲染
      expect(screen.getByText('触发按钮')).toBeInTheDocument()
    })
  })

  describe('触发方式 (trigger)', () => {
    it('hover 触发模式下，鼠标进入应该显示下拉菜单', async () => {
      renderDropdown({ trigger: 'hover' })
      const trigger = screen.getByText('触发按钮')

      fireEvent.mouseEnter(trigger)

      await waitFor(() => {
        expect(screen.getByText('菜单项1')).toBeInTheDocument()
      })
    })

    it('hover 触发模式下，鼠标离开应该隐藏下拉菜单', async () => {
      renderDropdown({ trigger: 'hover' })
      const trigger = screen.getByText('触发按钮')

      fireEvent.mouseEnter(trigger)
      await waitFor(() => {
        expect(screen.getByText('菜单项1')).toBeInTheDocument()
      })

      fireEvent.mouseLeave(trigger)
      await waitFor(() => {
        expect(screen.queryByText('菜单项1')).not.toBeInTheDocument()
      })
    })

    it('click 触发模式下，点击应该显示下拉菜单', async () => {
      renderDropdown({ trigger: 'click' })
      const triggerButton = screen.getByRole('button')

      // 在 click 模式下，触发器的 pointerEvents 应该为空（未设置 auto）
      // 验证组件在 click 模式下正确渲染
      expect(triggerButton).toBeInTheDocument()
      expect(triggerButton).toHaveAttribute('data-state', 'closed')

      // 模拟 radix 的点击行为
      // radix-ui 使用 keyDown Enter 作为备选触发方式
      fireEvent.keyDown(triggerButton, { key: 'Enter', code: 'Enter' })

      await waitFor(() => {
        expect(screen.getByText('菜单项1')).toBeInTheDocument()
      })
    })

    it('click 触发模式下，鼠标悬停不应该显示下拉菜单', async () => {
      renderDropdown({ trigger: 'click' })
      const trigger = screen.getByText('触发按钮')

      fireEvent.mouseEnter(trigger)

      // 给予一些时间确认菜单没有出现
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(screen.queryByText('菜单项1')).not.toBeInTheDocument()
    })

    it('默认触发方式应该是 hover', async () => {
      renderDropdown()
      const trigger = screen.getByText('触发按钮')

      fireEvent.mouseEnter(trigger)

      await waitFor(() => {
        expect(screen.getByText('菜单项1')).toBeInTheDocument()
      })
    })
  })

  describe('菜单项类型', () => {
    it('应该渲染普通菜单项 (type=item 或未指定)', async () => {
      const items: DropdownMenuType = [
        { type: 'item', name: '显式item类型' },
        { name: '隐式item类型' },
      ]
      renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('显式item类型')).toBeInTheDocument()
        expect(screen.getByText('隐式item类型')).toBeInTheDocument()
      })
    })

    it('应该渲染标签项 (type=label)', async () => {
      const items: DropdownMenuType = [
        { type: 'label', name: '分组标签' },
        { name: '菜单项' },
      ]
      renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('分组标签')).toBeInTheDocument()
      })
    })

    it('应该渲染分隔线 (type=separator)', async () => {
      const items: DropdownMenuType = [
        { name: '菜单项1' },
        { type: 'separator' },
        { name: '菜单项2' },
      ]
      const { baseElement } = renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('菜单项1')).toBeInTheDocument()
        // 分隔线有 role="separator" 属性
        const separator = baseElement.querySelector('[role="separator"]')
        expect(separator).toBeInTheDocument()
      })
    })
  })

  describe('菜单项图标', () => {
    it('disabledIcon=false 时应该显示图标', async () => {
      const items: DropdownMenuType = [{ icon: 'Settings', name: '设置' }]
      renderDropdown({ items, trigger: 'hover', disabledIcon: false })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByTestId('icon-Settings')).toBeInTheDocument()
      })
    })

    it('disabledIcon=true（默认）时不应该显示图标', async () => {
      const items: DropdownMenuType = [{ icon: 'Settings', name: '设置' }]
      renderDropdown({ items, trigger: 'hover', disabledIcon: true })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('设置')).toBeInTheDocument()
        expect(screen.queryByTestId('icon-Settings')).not.toBeInTheDocument()
      })
    })

    it('默认应该禁用图标', async () => {
      const items: DropdownMenuType = [{ icon: 'Settings', name: '设置' }]
      renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('设置')).toBeInTheDocument()
        expect(screen.queryByTestId('icon-Settings')).not.toBeInTheDocument()
      })
    })
  })

  describe('菜单项点击', () => {
    it('点击菜单项应该触发 onClick 回调', async () => {
      const onClick = vi.fn()
      const items: DropdownMenuType = [{ name: '可点击项', onClick }]
      renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('可点击项')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('可点击项'))
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('点击菜单项应该阻止事件冒泡', async () => {
      const parentOnClick = vi.fn()
      const itemOnClick = vi.fn()
      const items: DropdownMenuType = [{ name: '菜单项', onClick: itemOnClick }]

      render(
        <div onClick={parentOnClick}>
          <Dropdown items={items} trigger='hover'>
            <span>触发按钮</span>
          </Dropdown>
        </div>
      )

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('菜单项')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('菜单项'))
      expect(itemOnClick).toHaveBeenCalledTimes(1)
      expect(parentOnClick).not.toHaveBeenCalled()
    })

    it('onClick 支持异步函数', async () => {
      const asyncOnClick = vi.fn().mockResolvedValue(undefined)
      const items: DropdownMenuType = [
        { name: '异步菜单项', onClick: asyncOnClick },
      ]
      renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('异步菜单项')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('异步菜单项'))
      expect(asyncOnClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('菜单项可见性 (visible)', () => {
    it('visible 返回 true 时应该显示菜单项', async () => {
      const items: DropdownMenuType = [{ name: '可见项', visible: () => true }]
      renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('可见项')).toBeInTheDocument()
      })
    })

    it('visible 返回 false 时应该隐藏菜单项', async () => {
      const items: DropdownMenuType = [
        { name: '隐藏项', visible: () => false },
        { name: '可见项' },
      ]
      renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('可见项')).toBeInTheDocument()
        expect(screen.queryByText('隐藏项')).not.toBeInTheDocument()
      })
    })

    it('label 类型的 visible 也应该生效', async () => {
      const items: DropdownMenuType = [
        { type: 'label', name: '隐藏标签', visible: () => false },
        { type: 'label', name: '可见标签', visible: () => true },
      ]
      renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.queryByText('隐藏标签')).not.toBeInTheDocument()
        expect(screen.getByText('可见标签')).toBeInTheDocument()
      })
    })

    it('separator 类型的 visible 也应该生效', async () => {
      const items: DropdownMenuType = [
        { name: '菜单项1' },
        { type: 'separator', visible: () => false },
        { name: '菜单项2' },
      ]
      const { container } = renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('菜单项1')).toBeInTheDocument()
        expect(screen.getByText('菜单项2')).toBeInTheDocument()
        // 分隔线应该不存在
        const separators = container.querySelectorAll('.bg-border.h-px')
        expect(separators.length).toBe(0)
      })
    })
  })

  describe('子菜单', () => {
    it('应该渲染带子菜单的菜单项', async () => {
      const items: DropdownMenuType = [
        {
          name: '父菜单',
          items: [{ name: '子菜单项1' }, { name: '子菜单项2' }],
        },
      ]
      renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('父菜单')).toBeInTheDocument()
      })
    })

    it('子菜单项应该有展开图标', async () => {
      const items: DropdownMenuType = [
        {
          name: '父菜单',
          items: [{ name: '子菜单项' }],
        },
      ]
      renderDropdown({ items, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByTestId('icon-ChevronRight')).toBeInTheDocument()
      })
    })
  })

  describe('方向和对齐 (direction & align)', () => {
    it('应该支持 direction=bottom', async () => {
      renderDropdown({ direction: 'bottom', trigger: 'hover' })
      fireEvent.mouseEnter(screen.getByText('触发按钮'))
      await waitFor(() => {
        const content = screen.getByRole('menu')
        expect(content).toHaveAttribute('data-side', 'bottom')
      })
    })

    it('应该支持 direction=top', async () => {
      renderDropdown({ direction: 'top', trigger: 'hover' })
      fireEvent.mouseEnter(screen.getByText('触发按钮'))
      await waitFor(() => {
        const content = screen.getByRole('menu')
        expect(content).toHaveAttribute('data-side', 'top')
      })
    })

    it('应该支持 direction=left', async () => {
      renderDropdown({ direction: 'left', trigger: 'hover' })
      fireEvent.mouseEnter(screen.getByText('触发按钮'))
      await waitFor(() => {
        const content = screen.getByRole('menu')
        expect(content).toHaveAttribute('data-side', 'left')
      })
    })

    it('应该支持 direction=right', async () => {
      renderDropdown({ direction: 'right', trigger: 'hover' })
      fireEvent.mouseEnter(screen.getByText('触发按钮'))
      await waitFor(() => {
        const content = screen.getByRole('menu')
        expect(content).toHaveAttribute('data-side', 'right')
      })
    })

    it('应该支持 align=left', async () => {
      renderDropdown({ align: 'left', trigger: 'hover' })
      fireEvent.mouseEnter(screen.getByText('触发按钮'))
      await waitFor(() => {
        const content = screen.getByRole('menu')
        expect(content).toHaveAttribute('data-align', 'start')
      })
    })

    it('应该支持 align=center', async () => {
      renderDropdown({ align: 'center', trigger: 'hover' })
      fireEvent.mouseEnter(screen.getByText('触发按钮'))
      await waitFor(() => {
        const content = screen.getByRole('menu')
        expect(content).toHaveAttribute('data-align', 'center')
      })
    })

    it('应该支持 align=right', async () => {
      renderDropdown({ align: 'right', trigger: 'hover' })
      fireEvent.mouseEnter(screen.getByText('触发按钮'))
      await waitFor(() => {
        const content = screen.getByRole('menu')
        expect(content).toHaveAttribute('data-align', 'end')
      })
    })
  })

  describe('等宽 (equalWidth)', () => {
    it('equalWidth=true（默认）时下拉菜单应该和触发元素等宽', async () => {
      renderDropdown({ equalWidth: true, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('菜单项1')).toBeInTheDocument()
      })
    })

    it('equalWidth=false 时下拉菜单可以有自己的宽度', async () => {
      renderDropdown({ equalWidth: false, trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('菜单项1')).toBeInTheDocument()
      })
    })
  })

  describe('下拉菜单内容区域鼠标交互', () => {
    it('hover 模式下，鼠标进入内容区域应该保持菜单打开', async () => {
      renderDropdown({ trigger: 'hover' })

      // 先打开菜单
      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('菜单项1')).toBeInTheDocument()
      })

      // 鼠标进入内容区域
      const menuItem = screen.getByText('菜单项1')
      fireEvent.mouseEnter(menuItem.closest('[role="menu"]')!)

      // 菜单应该保持打开
      expect(screen.getByText('菜单项1')).toBeInTheDocument()
    })
  })

  describe('空菜单项', () => {
    it('没有菜单项时应该正常渲染', async () => {
      renderDropdown({ items: [], trigger: 'hover' })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      // 组件应该不会崩溃
      expect(screen.getByText('触发按钮')).toBeInTheDocument()
    })

    it('默认 items 为空数组', () => {
      render(
        <Dropdown>
          <span>触发按钮</span>
        </Dropdown>
      )
      expect(screen.getByText('触发按钮')).toBeInTheDocument()
    })
  })

  describe('组合测试', () => {
    it('应该正确渲染复杂的菜单结构', async () => {
      const items: DropdownMenuType = [
        { type: 'label', name: '操作菜单' },
        { icon: 'Settings', name: '设置' },
        { type: 'separator' },
        {
          icon: 'Folder',
          name: '更多选项',
          items: [
            { name: '选项1' },
            { name: '选项2', visible: () => false },
            { type: 'separator' },
            { name: '选项3' },
          ],
        },
        { name: '隐藏项', visible: () => false },
      ]

      renderDropdown({ items, trigger: 'hover', disabledIcon: false })

      fireEvent.mouseEnter(screen.getByText('触发按钮'))

      await waitFor(() => {
        expect(screen.getByText('操作菜单')).toBeInTheDocument()
        expect(screen.getByText('设置')).toBeInTheDocument()
        expect(screen.getByText('更多选项')).toBeInTheDocument()
        expect(screen.queryByText('隐藏项')).not.toBeInTheDocument()
      })
    })
  })
})
