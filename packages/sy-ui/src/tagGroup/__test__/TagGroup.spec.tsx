import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TagGroup } from '../TagGroup'

describe('TagGroup 标签组组件', () => {
  const defaultValue = ['标签1', '标签2', '标签3']

  describe('基础渲染', () => {
    it('应该正确渲染所有标签', () => {
      render(<TagGroup value={defaultValue} />)
      expect(screen.getByText('标签1')).toBeInTheDocument()
      expect(screen.getByText('标签2')).toBeInTheDocument()
      expect(screen.getByText('标签3')).toBeInTheDocument()
    })

    it('空值时不应该渲染标签', () => {
      const { container } = render(<TagGroup value={[]} />)
      expect(container.firstChild).toBeInTheDocument()
      expect(container.firstChild?.childNodes.length).toBe(0)
    })
  })

  describe('尺寸 (size)', () => {
    it('sm 尺寸应该正确渲染', () => {
      const { container } = render(<TagGroup value={defaultValue} size='sm' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('lg 尺寸应该正确渲染', () => {
      const { container } = render(<TagGroup value={defaultValue} size='lg' />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('圆角 (rounded)', () => {
    it('rounded 为 true 时标签应该有圆角', () => {
      const { container } = render(<TagGroup value={defaultValue} rounded />)
      expect(container.querySelector('.rounded-full')).toBeInTheDocument()
    })
  })

  describe('边框 (border)', () => {
    it('border 为 true 时标签应该有边框', () => {
      const { container } = render(<TagGroup value={defaultValue} border />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('无样式模式 (noStyle)', () => {
    it('noStyle 为 true 时应该显示纯文本', () => {
      const { container } = render(<TagGroup value={defaultValue} noStyle />)
      expect(container.textContent).toContain('标签1')
      expect(container.textContent).toContain(',')
    })
  })

  describe('自定义名称 (getName)', () => {
    it('应该支持自定义名称获取函数', () => {
      const items = [
        { id: 1, title: '选项A' },
        { id: 2, title: '选项B' },
      ]
      render(<TagGroup value={items} getName={(item) => item.title} />)
      expect(screen.getByText('选项A')).toBeInTheDocument()
      expect(screen.getByText('选项B')).toBeInTheDocument()
    })
  })

  describe('自定义颜色 (getColor)', () => {
    it('应该支持自定义颜色获取函数', () => {
      const items = ['重要', '普通']
      const { container } = render(
        <TagGroup
          value={items}
          getColor={(item) => (item === '重要' ? 'red' : 'gray')}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('自定义图标 (getIcon)', () => {
    it('应该支持自定义图标获取函数', () => {
      const { container } = render(
        <TagGroup value={defaultValue} getIcon={() => 'Star'} />
      )
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('组合场景', () => {
    it('带圆角和边框的标签组应该正确渲染', () => {
      render(<TagGroup value={defaultValue} rounded border />)
      expect(screen.getByText('标签1')).toBeInTheDocument()
      expect(screen.getByText('标签2')).toBeInTheDocument()
    })
  })
})
