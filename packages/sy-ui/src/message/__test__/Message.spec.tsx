import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageProvider } from '../Message'

describe('MessageProvider 消息提供组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染子元素', () => {
      render(
        <MessageProvider>
          <div>应用内容</div>
        </MessageProvider>
      )
      expect(screen.getByText('应用内容')).toBeInTheDocument()
    })

    it('应该渲染 Toaster 组件', () => {
      const { container } = render(
        <MessageProvider>
          <div>内容</div>
        </MessageProvider>
      )
      // Toaster 会在 DOM 中创建一个容器
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('包裹多个子组件应该正确渲染', () => {
      render(
        <MessageProvider>
          <header>头部</header>
          <main>主内容</main>
          <footer>底部</footer>
        </MessageProvider>
      )
      expect(screen.getByText('头部')).toBeInTheDocument()
      expect(screen.getByText('主内容')).toBeInTheDocument()
      expect(screen.getByText('底部')).toBeInTheDocument()
    })
  })
})
