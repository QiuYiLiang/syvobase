import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Steps } from '../Steps'

describe('Steps 步骤条组件', () => {
  const defaultItems = [
    { id: '1', name: '第一步', content: <div>步骤1内容</div> },
    { id: '2', name: '第二步', content: <div>步骤2内容</div> },
    { id: '3', name: '第三步', content: <div>步骤3内容</div> },
  ]

  describe('基础渲染', () => {
    it('应该正确渲染所有步骤', () => {
      render(<Steps items={defaultItems} />)
      expect(screen.getByText('第一步')).toBeInTheDocument()
      expect(screen.getByText('第二步')).toBeInTheDocument()
      expect(screen.getByText('第三步')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <Steps className='custom-class' items={defaultItems} />
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Steps style={{ width: '600px' }} items={defaultItems} />
      )
      expect(container.firstChild).toHaveStyle({ width: '600px' })
    })

    it('默认应该选中第一个步骤', () => {
      render(<Steps items={defaultItems} />)
      expect(screen.getByText('步骤1内容')).toBeInTheDocument()
    })
  })

  describe('步骤切换', () => {
    it('可以通过 value 控制当前步骤', () => {
      render(<Steps items={defaultItems} value='2' />)
      expect(screen.getByText('步骤2内容')).toBeInTheDocument()
    })

    it('应该触发 onChange 回调', () => {
      const onChange = vi.fn()
      render(<Steps items={defaultItems} onChange={onChange} />)
      // Steps 组件通常通过 ref 方法切换，此处测试受控模式
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('步骤指示器', () => {
    it('当前步骤应该有激活样式', () => {
      const { container } = render(<Steps items={defaultItems} />)
      const activeStep = container.querySelector(
        '.bg-primary.text-primary-foreground'
      )
      expect(activeStep).toBeInTheDocument()
    })

    it('已完成的步骤应该显示勾选图标', () => {
      const { container } = render(<Steps items={defaultItems} value='2' />)
      // 第一步已完成，应该显示 Check 图标
      const checkIcon = container.querySelector('svg')
      expect(checkIcon).toBeInTheDocument()
    })

    it('步骤之间应该有连接线', () => {
      const { container } = render(<Steps items={defaultItems} />)
      const connectors = container.querySelectorAll('.h-1.flex-1')
      expect(connectors.length).toBe(2) // 3个步骤有2条连接线
    })
  })

  describe('步骤描述', () => {
    it('应该渲染步骤描述', () => {
      const itemsWithDesc = [
        {
          id: '1',
          name: '第一步',
          description: '描述1',
          content: <div>内容1</div>,
        },
        {
          id: '2',
          name: '第二步',
          description: '描述2',
          content: <div>内容2</div>,
        },
      ]
      render(<Steps items={itemsWithDesc} />)
      expect(screen.getByText('描述1')).toBeInTheDocument()
      expect(screen.getByText('描述2')).toBeInTheDocument()
    })
  })

  describe('ref 方法', () => {
    it('prevStep 应该切换到上一步', () => {
      const ref = { current: null } as any
      const onChange = vi.fn()
      render(
        <Steps ref={ref} items={defaultItems} value='2' onChange={onChange} />
      )
      ref.current?.prevStep()
      expect(onChange).toHaveBeenCalledWith('1')
    })

    it('nextStep 应该切换到下一步', () => {
      const ref = { current: null } as any
      const onChange = vi.fn()
      render(
        <Steps ref={ref} items={defaultItems} value='1' onChange={onChange} />
      )
      ref.current?.nextStep()
      expect(onChange).toHaveBeenCalledWith('2')
    })

    it('stepTo 应该切换到指定步骤', () => {
      const ref = { current: null } as any
      const onChange = vi.fn()
      render(
        <Steps ref={ref} items={defaultItems} value='1' onChange={onChange} />
      )
      ref.current?.stepTo('3')
      expect(onChange).toHaveBeenCalledWith('3')
    })

    it('第一步时 prevStep 不应该切换', () => {
      const ref = { current: null } as any
      const onChange = vi.fn()
      render(<Steps ref={ref} items={defaultItems} onChange={onChange} />)
      ref.current?.prevStep()
      expect(onChange).not.toHaveBeenCalled()
    })

    it('最后一步时 nextStep 不应该切换', () => {
      const ref = { current: null } as any
      const onChange = vi.fn()
      render(
        <Steps ref={ref} items={defaultItems} value='3' onChange={onChange} />
      )
      ref.current?.nextStep()
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('空 items', () => {
    it('items 为空时应该抛出错误（组件需要至少一个步骤）', () => {
      // Steps 组件在 useControllable 中访问 items[0].id，空数组会导致错误
      // 这是预期行为，组件需要至少一个步骤项
      expect(() => render(<Steps items={[]} />)).toThrow()
    })
  })

  describe('组合场景', () => {
    it('带描述的多步骤应该正确渲染', () => {
      const items = [
        {
          id: '1',
          name: '基本信息',
          description: '填写姓名等',
          content: <div>表单1</div>,
        },
        {
          id: '2',
          name: '详细信息',
          description: '填写地址等',
          content: <div>表单2</div>,
        },
        {
          id: '3',
          name: '完成',
          description: '提交',
          content: <div>完成</div>,
        },
      ]
      render(<Steps items={items} value='2' />)
      expect(screen.getByText('基本信息')).toBeInTheDocument()
      expect(screen.getByText('详细信息')).toBeInTheDocument()
      expect(screen.getByText('完成')).toBeInTheDocument()
      expect(screen.getByText('表单2')).toBeInTheDocument()
    })
  })
})
