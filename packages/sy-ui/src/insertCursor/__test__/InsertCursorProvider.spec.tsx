import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InsertCursorProvider } from '../InsertCursorProvider'

describe('InsertCursorProvider 插入光标提供者', () => {
  describe('基础渲染', () => {
    it('应该正确渲染子元素', () => {
      render(
        <InsertCursorProvider>
          <div>子内容</div>
        </InsertCursorProvider>
      )
      expect(screen.getByText('子内容')).toBeInTheDocument()
    })
  })

  describe('嵌套内容', () => {
    it('应该正确渲染多层嵌套内容', () => {
      render(
        <InsertCursorProvider>
          <div>
            <span>嵌套1</span>
            <span>嵌套2</span>
          </div>
        </InsertCursorProvider>
      )
      expect(screen.getByText('嵌套1')).toBeInTheDocument()
      expect(screen.getByText('嵌套2')).toBeInTheDocument()
    })
  })
})
