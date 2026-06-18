import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Watermark } from '../Watermark'

describe('Watermark 水印组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(
        <Watermark content='测试水印'>
          <div>内容区域</div>
        </Watermark>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该渲染子元素', () => {
      render(
        <Watermark content='水印'>
          <div>页面内容</div>
        </Watermark>
      )
      expect(screen.getByText('页面内容')).toBeInTheDocument()
    })
  })

  describe('水印内容 (content)', () => {
    it('应该支持字符串内容', () => {
      const { container } = render(
        <Watermark content='公司机密'>
          <div>内容</div>
        </Watermark>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持数组内容', () => {
      const { container } = render(
        <Watermark content={['第一行', '第二行']}>
          <div>内容</div>
        </Watermark>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带水印的内容区域应该正确渲染', () => {
      render(
        <Watermark content='仅供内部使用'>
          <div style={{ height: 500 }}>
            <h1>标题</h1>
            <p>段落内容</p>
          </div>
        </Watermark>
      )
      expect(screen.getByText('标题')).toBeInTheDocument()
      expect(screen.getByText('段落内容')).toBeInTheDocument()
    })
  })
})
