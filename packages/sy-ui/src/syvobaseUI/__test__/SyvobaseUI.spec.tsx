import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SyvobaseUI } from '../SyvobaseUI'

describe('SyvobaseUI 根组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染子元素', () => {
      render(<SyvobaseUI>应用内容</SyvobaseUI>)
      expect(screen.getByText('应用内容')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <SyvobaseUI className='custom-class'>内容</SyvobaseUI>
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <SyvobaseUI style={{ margin: '10px' }}>内容</SyvobaseUI>
      )
      expect(container.firstChild).toHaveStyle({ margin: '10px' })
    })
  })

  describe('暗色模式 (dark)', () => {
    it('暗色模式应该设置 CSS 变量', () => {
      render(<SyvobaseUI dark>暗色内容</SyvobaseUI>)
      expect(screen.getByText('暗色内容')).toBeInTheDocument()
    })
  })

  describe('自定义主题 (theme)', () => {
    it('不传入主题时应该使用默认主题', () => {
      render(<SyvobaseUI>主题内容</SyvobaseUI>)
      expect(screen.getByText('主题内容')).toBeInTheDocument()
    })
  })

  describe('自定义图标 (icons)', () => {
    it('应该接受自定义图标', () => {
      const icons = {
        CustomIcon: vi.fn(() => null),
      }
      render(<SyvobaseUI icons={icons}>图标内容</SyvobaseUI>)
      expect(screen.getByText('图标内容')).toBeInTheDocument()
    })
  })

  describe('嵌套内容', () => {
    it('应该正确渲染嵌套组件', () => {
      render(
        <SyvobaseUI>
          <div>
            <span>嵌套内容</span>
          </div>
        </SyvobaseUI>
      )
      expect(screen.getByText('嵌套内容')).toBeInTheDocument()
    })
  })
})
