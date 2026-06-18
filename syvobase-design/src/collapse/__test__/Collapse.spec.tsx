import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Collapse } from '../Collapse'

describe('Collapse 折叠面板组件', () => {
  const defaultItems = [
    { id: '1', name: '面板1', content: <div>内容1</div> },
    { id: '2', name: '面板2', content: <div>内容2</div> },
    { id: '3', name: '面板3', content: <div>内容3</div> },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染所有面板标题', () => {
      render(<Collapse items={defaultItems} />)
      expect(screen.getByText('面板1')).toBeInTheDocument()
      expect(screen.getByText('面板2')).toBeInTheDocument()
      expect(screen.getByText('面板3')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <Collapse className='custom-class' items={defaultItems} />
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Collapse style={{ width: '300px' }} items={defaultItems} />
      )
      expect(container.firstChild).toHaveStyle({ width: '300px' })
    })
  })

  describe('展开/折叠', () => {
    it('默认所有面板应该是折叠状态', () => {
      render(<Collapse items={defaultItems} />)
      expect(screen.queryByText('内容1')).not.toBeInTheDocument()
      expect(screen.queryByText('内容2')).not.toBeInTheDocument()
      expect(screen.queryByText('内容3')).not.toBeInTheDocument()
    })

    it('点击面板标题应该展开内容', () => {
      render(<Collapse items={defaultItems} />)
      fireEvent.click(screen.getByText('面板1'))
      expect(screen.getByText('内容1')).toBeInTheDocument()
    })

    it('再次点击应该折叠内容', () => {
      render(<Collapse items={defaultItems} />)
      fireEvent.click(screen.getByText('面板1'))
      expect(screen.getByText('内容1')).toBeInTheDocument()
      fireEvent.click(screen.getByText('面板1'))
      expect(screen.queryByText('内容1')).not.toBeInTheDocument()
    })

    it('可以通过 value 控制展开的面板', () => {
      render(<Collapse items={defaultItems} value={['1', '2']} />)
      expect(screen.getByText('内容1')).toBeInTheDocument()
      expect(screen.getByText('内容2')).toBeInTheDocument()
      expect(screen.queryByText('内容3')).not.toBeInTheDocument()
    })
  })

  describe('手风琴模式 (multiple)', () => {
    it('multiple 为 false 时只能展开一个面板', () => {
      render(<Collapse items={defaultItems} multiple={false} />)
      fireEvent.click(screen.getByText('面板1'))
      expect(screen.getByText('内容1')).toBeInTheDocument()
      fireEvent.click(screen.getByText('面板2'))
      expect(screen.queryByText('内容1')).not.toBeInTheDocument()
      expect(screen.getByText('内容2')).toBeInTheDocument()
    })

    it('默认 multiple 为 true，可以同时展开多个面板', () => {
      render(<Collapse items={defaultItems} />)
      fireEvent.click(screen.getByText('面板1'))
      fireEvent.click(screen.getByText('面板2'))
      expect(screen.getByText('内容1')).toBeInTheDocument()
      expect(screen.getByText('内容2')).toBeInTheDocument()
    })
  })

  describe('类型 (type)', () => {
    it('默认类型是 collapse', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      // collapse 类型有展开/折叠图标
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })

    it('group 类型应该始终显示内容', () => {
      render(<Collapse type='group' items={defaultItems} />)
      expect(screen.getByText('内容1')).toBeInTheDocument()
      expect(screen.getByText('内容2')).toBeInTheDocument()
      expect(screen.getByText('内容3')).toBeInTheDocument()
    })

    it('group 类型应该有左侧指示条', () => {
      const { container } = render(
        <Collapse type='group' items={defaultItems} />
      )
      const indicator = container.querySelector('.bg-primary.h-\\[18px\\]')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('边框 (border)', () => {
    it('默认应该有边框', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      expect(container.firstChild).toHaveClass('border')
    })

    it('border 为 false 时不应该有边框', () => {
      const { container } = render(
        <Collapse items={defaultItems} border={false} />
      )
      expect(container.firstChild).not.toHaveClass('border')
    })
  })

  describe('尺寸 (size)', () => {
    it('默认尺寸应该是 default', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('sm 尺寸应该正常渲染', () => {
      const { container } = render(<Collapse items={defaultItems} size='sm' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('lg 尺寸应该正常渲染', () => {
      const { container } = render(<Collapse items={defaultItems} size='lg' />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('禁用内边距 (disabledPadding)', () => {
    it('disabledPadding 为 true 时内容区域不应该有内边距', () => {
      render(<Collapse items={defaultItems} disabledPadding value={['1']} />)
      const content = screen.getByText('内容1')
      expect(content.parentElement).not.toHaveClass('pb-4')
    })
  })

  describe('工具栏 (toolbar)', () => {
    it('应该渲染面板工具栏', () => {
      const items = [
        {
          id: '1',
          name: '带工具栏的面板',
          content: <div>内容</div>,
          toolbar: [{ name: '编辑' }],
        },
      ]
      render(<Collapse items={items} />)
      expect(screen.getByText('编辑')).toBeInTheDocument()
    })
  })

  describe('onChange 回调', () => {
    it('展开面板时应该触发 onChange', () => {
      const onChange = vi.fn()
      render(<Collapse value={[]} items={defaultItems} onChange={onChange} />)
      fireEvent.click(screen.getByText('面板1'))
      expect(onChange).toHaveBeenCalledWith(['1'])
    })

    it('折叠面板时应该触发 onChange', () => {
      const onChange = vi.fn()
      render(
        <Collapse items={defaultItems} value={['1']} onChange={onChange} />
      )
      fireEvent.click(screen.getByText('面板1'))
      expect(onChange).toHaveBeenCalledWith([])
    })
  })

  describe('组合场景', () => {
    it('无边框的手风琴模式应该正确渲染', () => {
      const { container } = render(
        <Collapse items={defaultItems} border={false} multiple={false} />
      )
      expect(container.firstChild).not.toHaveClass('border')
      fireEvent.click(screen.getByText('面板1'))
      fireEvent.click(screen.getByText('面板2'))
      expect(screen.queryByText('内容1')).not.toBeInTheDocument()
      expect(screen.getByText('内容2')).toBeInTheDocument()
    })

    it('group 类型无边框应该正确渲染', () => {
      const { container } = render(
        <Collapse type='group' items={defaultItems} border={false} />
      )
      expect(container.firstChild).not.toHaveClass('border')
      expect(screen.getByText('内容1')).toBeInTheDocument()
    })
  })
})
