import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Mindmap } from '../Mindmap'

// Mindmap 组件依赖 mind-elixir，已在 setup.ts 中 mock
describe('Mindmap 思维导图组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Mindmap />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(<Mindmap className='custom-class' />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(<Mindmap style={{ width: '100%' }} />)
      expect(container.firstChild).toHaveStyle({ width: '100%' })
    })
  })

  describe('值 (value)', () => {
    it('应该支持传入初始值', () => {
      const value = {
        nodeData: {
          id: 'root',
          topic: 'Root',
          children: [],
        },
      }
      const { container } = render(<Mindmap value={value} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('value 为 null 时应该渲染', () => {
      const { container } = render(<Mindmap value={null} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('readMode 为 true 时应该渲染', () => {
      const { container } = render(<Mindmap readMode />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时应该渲染', () => {
      const { container } = render(<Mindmap disabled />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
