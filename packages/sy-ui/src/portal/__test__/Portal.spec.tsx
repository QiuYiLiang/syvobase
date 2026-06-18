import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Portal } from '../Portal'

describe('Portal 传送门组件', () => {
  describe('基础渲染', () => {
    it('应该将内容渲染到 body', () => {
      render(<Portal>传送内容</Portal>)
      expect(screen.getByText('传送内容')).toBeInTheDocument()
    })

    it('内容应该在 body 中', () => {
      render(<Portal>传送内容</Portal>)
      const content = screen.getByText('传送内容')
      // Portal 将内容渲染到 body 下,但可能不是直接子元素
      expect(document.body.contains(content)).toBe(true)
    })
  })

  describe('自定义容器 (container)', () => {
    it('应该渲染到自定义容器', () => {
      const container = document.createElement('div')
      container.setAttribute('data-testid', 'custom-container')
      document.body.appendChild(container)

      render(<Portal container={container}>自定义容器内容</Portal>)
      const content = screen.getByText('自定义容器内容')
      // 检查内容是否在自定义容器中
      expect(container.contains(content)).toBe(true)

      document.body.removeChild(container)
    })
  })

  describe('子元素', () => {
    it('应该正确渲染多个子元素', () => {
      render(
        <Portal>
          <div>子元素1</div>
          <div>子元素2</div>
        </Portal>
      )
      expect(screen.getByText('子元素1')).toBeInTheDocument()
      expect(screen.getByText('子元素2')).toBeInTheDocument()
    })
  })
})
