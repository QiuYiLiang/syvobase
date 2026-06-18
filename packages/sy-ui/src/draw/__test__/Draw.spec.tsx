import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Draw } from '../Draw'

// Draw 组件依赖 react-drawio，已在 setup.ts 中 mock
describe('Draw 绘图组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Draw />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('值 (value)', () => {
    it('应该支持传入初始值', () => {
      const { container } = render(<Draw value='<xml>test</xml>' />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('只读模式 (readMode)', () => {
    it('readMode 为 true 时应该渲染', () => {
      const { container } = render(<Draw readMode />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('禁用状态 (disabled)', () => {
    it('disabled 为 true 时应该渲染', () => {
      const { container } = render(<Draw disabled />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('自动保存 (autoSave)', () => {
    it('autoSave 为 false 时应该渲染', () => {
      const { container } = render(<Draw autoSave={false} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('baseUrl', () => {
    it('应该支持自定义 baseUrl', () => {
      const { container } = render(<Draw baseUrl='https://example.com' />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
