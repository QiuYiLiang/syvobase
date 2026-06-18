import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from '../App'

describe('App 应用组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染子元素', () => {
      render(<App items={[]}>应用内容</App>)
      expect(screen.getByText('应用内容')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <App items={[]} className='custom-class'>
          内容
        </App>
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <App items={[]} style={{ padding: '10px' }}>
          内容
        </App>
      )
      expect(container.firstChild).toHaveStyle({ padding: '10px' })
    })
  })

  describe('类型 (type)', () => {
    it('type 为 line 时应该使用边框样式', () => {
      const { container } = render(
        <App items={[]} type='line' toolbar={{ items: [{ name: '按钮' }] }}>
          内容
        </App>
      )
      expect(container.querySelector('.border-b')).toBeInTheDocument()
    })

    it('type 为 rounded 时应该使用圆角样式', () => {
      const { container } = render(
        <App items={[]} type='rounded'>
          内容
        </App>
      )
      expect(container.querySelector('.bg-secondary\\/50')).toBeInTheDocument()
    })
  })

  describe('工具栏 (toolbar)', () => {
    it('应该渲染工具栏', () => {
      render(
        <App items={[]} toolbar={{ items: [{ name: '工具按钮' }] }}>
          内容
        </App>
      )
      expect(screen.getByText('工具按钮')).toBeInTheDocument()
    })

    it('无工具栏时不应渲染工具栏区域', () => {
      const { container } = render(<App items={[]}>内容</App>)
      expect(container.querySelector('.nk-toolbar')).not.toBeInTheDocument()
    })
  })

  describe('菜单项 (items)', () => {
    it('应该渲染菜单项', () => {
      render(<App items={[{ id: '1', name: '菜单项1' }]}>内容</App>)
      // 菜单项通过 Menu 组件渲染，验证菜单项文本存在
      expect(screen.getByText('菜单项1')).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带工具栏和菜单项的应用应该正确渲染', () => {
      render(
        <App
          type='line'
          items={[{ id: '1', name: '首页' }]}
          toolbar={{ items: [{ name: '设置' }] }}
        >
          主内容区域
        </App>
      )
      // 验证菜单项、工具栏和内容都正确渲染
      expect(screen.getByText('首页')).toBeInTheDocument()
      expect(screen.getByText('设置')).toBeInTheDocument()
      expect(screen.getByText('主内容区域')).toBeInTheDocument()
    })
  })
})
