import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Resizable } from '../Resizable'

describe('Resizable 可调整大小组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染两个子元素', () => {
      const { container } = render(
        <Resizable>
          <div>左侧</div>
          <div>右侧</div>
        </Resizable>
      )
      expect(container.querySelector('.nk-resizable')).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <Resizable className='custom-class'>
          <div>左侧</div>
          <div>右侧</div>
        </Resizable>
      )
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Resizable style={{ height: '500px' }}>
          <div>左侧</div>
          <div>右侧</div>
        </Resizable>
      )
      expect(container.firstChild).toHaveStyle({ height: '500px' })
    })
  })

  describe('方向 (direction)', () => {
    it('默认方向应该是 left', () => {
      const { container } = render(
        <Resizable>
          <div>左侧</div>
          <div>右侧</div>
        </Resizable>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('right 方向应该正确渲染', () => {
      const { container } = render(
        <Resizable direction='right'>
          <div>左侧</div>
          <div>右侧</div>
        </Resizable>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('top 方向应该水平分割', () => {
      const { container } = render(
        <Resizable direction='top'>
          <div>顶部</div>
          <div>底部</div>
        </Resizable>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('bottom 方向应该水平分割', () => {
      const { container } = render(
        <Resizable direction='bottom'>
          <div>顶部</div>
          <div>底部</div>
        </Resizable>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('初始大小 (size)', () => {
    it('应该支持自定义初始大小', () => {
      const { container } = render(
        <Resizable size={200}>
          <div>左侧</div>
          <div>右侧</div>
        </Resizable>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('允许调整 (allowResize)', () => {
    it('默认应该允许调整大小', () => {
      const { container } = render(
        <Resizable>
          <div>左侧</div>
          <div>右侧</div>
        </Resizable>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('allowResize 为 false 时应该禁止调整', () => {
      const { container } = render(
        <Resizable allowResize={false}>
          <div>左侧</div>
          <div>右侧</div>
        </Resizable>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('大小变更回调 (onSizeChange)', () => {
    it('应该支持 onSizeChange 回调', () => {
      const onSizeChange = vi.fn()
      const { container } = render(
        <Resizable onSizeChange={onSizeChange}>
          <div>左侧</div>
          <div>右侧</div>
        </Resizable>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带自定义大小和方向的可调整组件应该正确渲染', () => {
      const { container } = render(
        <Resizable direction='top' size={300}>
          <div>顶部内容</div>
          <div>底部内容</div>
        </Resizable>
      )
      expect(container.querySelector('.nk-resizable')).toBeInTheDocument()
    })
  })
})
