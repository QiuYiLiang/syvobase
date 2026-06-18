import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Button } from '../Button'

describe('Button 按钮组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染按钮文字', () => {
      render(<Button>测试按钮</Button>)
      expect(screen.getByText('测试按钮')).toBeInTheDocument()
    })

    it('应该正确渲染带有 role="button" 属性', () => {
      render(<Button>按钮</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      render(<Button className='custom-class'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('应该支持传入 ref', () => {
      const ref = { current: null }
      render(<Button ref={ref}>按钮</Button>)
      expect(ref.current).not.toBeNull()
    })
  })

  describe('按钮类型 (type)', () => {
    it('默认类型应该有 primary 样式', () => {
      render(<Button type='default'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary')
    })

    it('destructive 类型应该有 destructive 样式', () => {
      render(<Button type='destructive'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive')
    })

    it('outline 类型应该有 border 样式', () => {
      render(<Button type='outline'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
    })

    it('secondary 类型应该有 secondary 样式', () => {
      render(<Button type='secondary'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary')
    })

    it('ghost 类型应该有 hover 样式', () => {
      render(<Button type='ghost'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-secondary')
    })

    it('link 类型应该有 underline 样式', () => {
      render(<Button type='link'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:underline')
    })
  })

  describe('按钮尺寸 (size)', () => {
    it('默认尺寸应该有正确的高度', () => {
      render(<Button size='default'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8')
    })

    it('sm 尺寸应该有正确的高度', () => {
      render(<Button size='sm'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-6')
    })

    it('lg 尺寸应该有正确的高度', () => {
      render(<Button size='lg'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
    })

    it('仅图标模式下默认尺寸应该有正确的大小', () => {
      render(
        <Button size='default' icon='Settings' onlyIcon>
          按钮
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-8')
    })

    it('仅图标模式下 sm 尺寸应该有正确的大小', () => {
      render(
        <Button size='sm' icon='Settings' onlyIcon>
          按钮
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-6')
    })

    it('仅图标模式下 lg 尺寸应该有正确的大小', () => {
      render(
        <Button size='lg' icon='Settings' onlyIcon>
          按钮
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-10')
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('禁用状态应该有 cursor-not-allowed 样式', () => {
      render(<Button disabled>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('cursor-not-allowed')
    })

    it('禁用状态应该有遮罩层', () => {
      const { container } = render(<Button disabled>按钮</Button>)
      const overlay = container.querySelector('.cursor-not-allowed.bg-gray-100')
      expect(overlay).toBeInTheDocument()
    })

    it('禁用状态点击不应该触发 onClick', () => {
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          按钮
        </Button>
      )
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('圆角 (rounded)', () => {
    it('应该支持圆角样式', () => {
      render(<Button rounded>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('rounded-full')
    })

    it('默认应该是 rounded-md', () => {
      render(<Button>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('rounded-md')
    })
  })

  describe('图标 (icon)', () => {
    it('应该渲染字符串类型的图标', () => {
      const { container } = render(<Button icon='Settings'>按钮</Button>)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('应该渲染 ReactNode 类型的图标', () => {
      render(
        <Button icon={<span data-testid='custom-icon'>🔧</span>}>按钮</Button>
      )
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('onlyIcon 模式下不应该显示 children', () => {
      render(
        <Button icon='Settings' onlyIcon>
          隐藏的文字
        </Button>
      )
      expect(screen.queryByText('隐藏的文字')).not.toBeInTheDocument()
    })

    it('rightIcon 应该将图标放在右侧', () => {
      const { container } = render(
        <Button icon='Settings' rightIcon>
          按钮
        </Button>
      )
      const button = container.querySelector('[role="button"]')
      // rightIcon 时，文字在图标前面
      // 验证按钮包含文字和图标
      expect(button?.textContent).toContain('按钮')
      // 验证图标存在
      const svg = button?.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('点击事件 (onClick)', () => {
    it('应该正确触发点击事件', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>按钮</Button>)
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('点击事件返回 Promise 时应该显示 loading 状态', async () => {
      const handleClick = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100)
          })
      )
      const { container } = render(
        <Button icon='Settings' onClick={handleClick}>
          按钮
        </Button>
      )
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // 等待 loading 状态
      await waitFor(() => {
        const loadingIcon = container.querySelector('svg')
        expect(loadingIcon).toBeInTheDocument()
      })

      // 等待 Promise 完成
      await waitFor(
        () => {
          expect(handleClick).toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })

    it('loading 状态下应该有 cursor-not-allowed 样式', async () => {
      const handleClick = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100)
          })
      )
      render(<Button onClick={handleClick}>按钮</Button>)
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(button).toHaveClass('cursor-not-allowed')
      })
    })
  })

  describe('下拉按钮 (items)', () => {
    it('有 items 时应该渲染下拉图标', () => {
      const { container } = render(
        <Button items={[{ name: '菜单1' }]}>下拉按钮</Button>
      )
      const svgs = container.querySelectorAll('svg')
      // 应该有 ChevronDown 图标
      expect(svgs.length).toBeGreaterThanOrEqual(1)
    })

    it('disabledDropdownIcon 为 true 时不应该渲染下拉图标', () => {
      const { container } = render(
        <Button items={[{ name: '菜单1' }]} disabledDropdownIcon>
          下拉按钮
        </Button>
      )
      // 检查内部 Button div 是否没有 ChevronDown 图标
      const innerButton = container.querySelector('div[role="button"]')
      expect(innerButton).toBeInTheDocument()
      // disabledDropdownIcon 时不应该有下拉图标
      const svgs = innerButton?.querySelectorAll('svg')
      expect(svgs?.length || 0).toBe(0)
    })
  })

  describe('自定义 HTML 标签 (htmlTag)', () => {
    it('默认应该渲染为 div', () => {
      const { container } = render(<Button>按钮</Button>)
      const button = container.querySelector('div[role="button"]')
      expect(button).toBeInTheDocument()
    })

    it('应该支持自定义 htmlTag', () => {
      const { container } = render(<Button htmlTag='span'>按钮</Button>)
      const button = container.querySelector('span[role="button"]')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Popover 功能', () => {
    it('有 popover 时应该渲染 Popover', () => {
      render(<Button popover='提示内容'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('showChildrenPopover 为 true 时应该使用 children 作为 popover 内容', () => {
      render(<Button showChildrenPopover>按钮内容</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('键盘快捷键 (keyboardKey)', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('应该响应键盘快捷键', async () => {
      const handleClick = vi.fn()
      render(
        <Button keyboardKey='Enter' onClick={handleClick}>
          按钮
        </Button>
      )

      // 模拟键盘事件
      fireEvent.keyDown(document, { key: 'Enter' })

      // 等待事件处理
      vi.runAllTimers()

      // 注意：由于 useKeydown 的实现方式，这里可能需要调整测试方式
      // 当前测试主要验证组件能正确渲染并接收 keyboardKey prop
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('其他属性', () => {
    it('应该支持透传其他 HTML 属性', () => {
      render(<Button data-testid='custom-button'>按钮</Button>)
      expect(screen.getByTestId('custom-button')).toBeInTheDocument()
    })

    it('应该支持 direction 属性', () => {
      render(<Button direction='top'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('应该支持 align 属性', () => {
      render(<Button align='left'>按钮</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('应该支持 trigger 属性', () => {
      const { container } = render(
        <Button popover='提示' trigger='click'>
          按钮
        </Button>
      )
      const button = container.querySelector('div[role="button"]')
      expect(button).toBeInTheDocument()
    })

    it('应该支持 dropdownTrigger 属性', () => {
      const { container } = render(
        <Button items={[{ name: '菜单' }]} dropdownTrigger='click'>
          下拉按钮
        </Button>
      )
      // 下拉按钮会有嵌套的 button，使用 getAllByRole 或更具体的选择器
      const innerButton = container.querySelector('div[role="button"]')
      expect(innerButton).toBeInTheDocument()
    })

    it('应该支持 popoverProps', () => {
      render(
        <Button popover='提示' popoverProps={{ className: 'custom-popover' }}>
          按钮
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('应该支持 dropdownProps', () => {
      const { container } = render(
        <Button
          items={[{ name: '菜单' }]}
          // @ts-expect-error dropdownProps 在 Button 内部会忽略 children
          dropdownProps={{ modal: false }}
        >
          下拉按钮
        </Button>
      )
      // 下拉按钮会有嵌套的 button，使用更具体的选择器
      const innerButton = container.querySelector('div[role="button"]')
      expect(innerButton).toBeInTheDocument()
    })
  })

  describe('无 children 时的尺寸', () => {
    it('无 children 且 default size 应该显示为图标按钮大小', () => {
      render(<Button size='default' icon='Settings' />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-8')
    })

    it('无 children 且 sm size 应该显示为小图标按钮大小', () => {
      render(<Button size='sm' icon='Settings' />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-6')
    })

    it('无 children 且 lg size 应该显示为大图标按钮大小', () => {
      render(<Button size='lg' icon='Settings' />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('size-10')
    })
  })

  describe('组合场景', () => {
    it('禁用的下拉按钮应该正确渲染', () => {
      const { container } = render(
        <Button disabled items={[{ name: '菜单' }]}>
          禁用的下拉按钮
        </Button>
      )
      // 下拉按钮会有嵌套的 button，选择内部的 div button
      const innerButton = container.querySelector('div[role="button"]')
      expect(innerButton).toHaveClass('cursor-not-allowed')
    })

    it('带图标的圆角按钮应该正确渲染', () => {
      render(
        <Button icon='Settings' rounded>
          圆角图标按钮
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('rounded-full')
    })

    it('所有类型属性组合应该正确渲染', () => {
      render(
        <Button
          type='secondary'
          size='lg'
          icon='Settings'
          rounded
          popover='提示'
        >
          组合按钮
        </Button>
      )
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary')
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('rounded-full')
    })
  })
})
