import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from '../Toolbar'

describe('Toolbar 工具栏组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Toolbar />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Toolbar className='custom-class' />)
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(<Toolbar style={{ gap: '10px' }} />)
      expect(container.firstChild).toHaveStyle({ gap: '10px' })
    })
  })

  describe('左侧工具项 (left)', () => {
    it('应该渲染左侧工具项', () => {
      render(<Toolbar left={[{ name: '左侧按钮' }]} />)
      expect(screen.getByText('左侧按钮')).toBeInTheDocument()
    })

    it('应该支持多个左侧工具项', () => {
      render(<Toolbar left={[{ name: '按钮1' }, { name: '按钮2' }]} />)
      expect(screen.getByText('按钮1')).toBeInTheDocument()
      expect(screen.getByText('按钮2')).toBeInTheDocument()
    })
  })

  describe('中间工具项 (items)', () => {
    it('应该渲染中间工具项', () => {
      render(<Toolbar items={[{ name: '中间按钮' }]} />)
      expect(screen.getByText('中间按钮')).toBeInTheDocument()
    })
  })

  describe('右侧工具项 (right)', () => {
    it('应该渲染右侧工具项', () => {
      render(<Toolbar right={[{ name: '右侧按钮' }]} />)
      expect(screen.getByText('右侧按钮')).toBeInTheDocument()
    })
  })

  describe('ReactNode 工具项', () => {
    it('应该支持 ReactNode 类型的工具项', () => {
      render(<Toolbar left={[<span key='custom'>自定义元素</span>]} />)
      expect(screen.getByText('自定义元素')).toBeInTheDocument()
    })
  })

  describe('工具项点击', () => {
    it('点击工具项应该触发 onClick', () => {
      const onClick = vi.fn()
      render(<Toolbar left={[{ name: '点击我', onClick }]} />)
      fireEvent.click(screen.getByText('点击我'))
      expect(onClick).toHaveBeenCalled()
    })
  })

  describe('尺寸 (size)', () => {
    it('默认尺寸应该正常渲染', () => {
      const { container } = render(
        <Toolbar left={[{ name: '按钮' }]} size='default' />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('sm 尺寸应该正常渲染', () => {
      render(<Toolbar left={[{ name: '小按钮' }]} size='sm' />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-6')
    })

    it('lg 尺寸应该正常渲染', () => {
      render(<Toolbar left={[{ name: '大按钮' }]} size='lg' />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
    })
  })

  describe('按钮类型 (type)', () => {
    it('应该应用统一的按钮类型', () => {
      render(<Toolbar left={[{ name: '按钮' }]} type='secondary' />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary')
    })
  })

  describe('仅图标模式 (onlyIcon)', () => {
    it('onlyIcon 为 true 时按钮应该只显示图标', () => {
      render(<Toolbar left={[{ name: '按钮', icon: 'Settings' }]} onlyIcon />)
      expect(screen.queryByText('按钮')).not.toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时所有按钮都应该禁用', () => {
      const { container } = render(
        <Toolbar left={[{ name: '按钮' }]} disabled />
      )
      const button = container.querySelector('.cursor-not-allowed')
      expect(button).toBeInTheDocument()
    })
  })

  describe('工具项可见性 (visible)', () => {
    it('visible 返回 false 时不应该显示工具项', () => {
      render(
        <Toolbar
          left={[
            { name: '显示', visible: () => true },
            { name: '隐藏', visible: () => false },
          ]}
        />
      )
      expect(screen.getByText('显示')).toBeInTheDocument()
      expect(screen.queryByText('隐藏')).not.toBeInTheDocument()
    })
  })

  describe('全宽模式 (fullMode)', () => {
    it('fullMode 为 true 时中间工具项应该占满', () => {
      const { container } = render(
        <Toolbar items={[{ name: '中间' }]} fullMode />
      )
      expect(container.querySelector('.w-full')).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('左中右布局应该正确渲染', () => {
      render(
        <Toolbar
          left={[{ name: '左' }]}
          items={[{ name: '中' }]}
          right={[{ name: '右' }]}
        />
      )
      expect(screen.getByText('左')).toBeInTheDocument()
      expect(screen.getByText('中')).toBeInTheDocument()
      expect(screen.getByText('右')).toBeInTheDocument()
    })

    it('带图标的小尺寸禁用工具栏应该正确渲染', () => {
      const { container } = render(
        <Toolbar
          left={[{ name: '设置', icon: 'Settings' }]}
          size='sm'
          disabled
        />
      )
      expect(container.querySelector('svg')).toBeInTheDocument()
      expect(container.querySelector('.cursor-not-allowed')).toBeInTheDocument()
    })
  })
})
