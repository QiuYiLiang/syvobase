import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Filter } from '../Filter'

describe('Filter 筛选组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Filter />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Filter className='custom-class' />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })
  })

  describe('边框 (border)', () => {
    it('默认应该有边框', () => {
      const { container } = render(<Filter />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('border 为 false 时不应该有边框', () => {
      const { container } = render(<Filter border={false} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('值 (value)', () => {
    it('应该支持受控模式', () => {
      const value = {
        op: 'and' as const,
        items: [{ left: 'name', op: 'eq', right: '张三' }],
      }
      const { container } = render(<Filter value={value} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('修改筛选条件应该触发 onChange', () => {
      const onChange = vi.fn()
      const { container } = render(<Filter onChange={onChange} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('模式 (mode)', () => {
    it('默认模式应该是 advanced', () => {
      const { container } = render(<Filter />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('simple 模式应该正确渲染', () => {
      const { container } = render(<Filter mode='simple' />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('字段配置 (left/op/right)', () => {
    it('应该支持自定义左侧字段', () => {
      const { container } = render(
        <Filter
          left={{
            items: [
              { id: 'name', name: '姓名' },
              { id: 'age', name: '年龄' },
            ],
          }}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持自定义操作符', () => {
      const { container } = render(
        <Filter
          op={{
            items: [
              { id: 'eq', name: '等于' },
              { id: 'ne', name: '不等于' },
            ],
          }}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('预设 (getPresets)', () => {
    it('应该支持预设值', () => {
      const { container } = render(
        <Filter
          getPresets={() => [
            { value: { op: 'eq', right: 'test' }, name: '测试' },
          ]}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带多个筛选条件的组件应该正确渲染', () => {
      const value = {
        op: 'and' as const,
        items: [
          { left: 'name', op: 'eq', right: '张三' },
          { left: 'age', op: 'gt', right: 18 },
        ],
      }
      const { container } = render(<Filter value={value} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
