import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from '../Avatar'

describe('Avatar 头像组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const { container } = render(<Avatar name='测试用户' />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('应该支持传入自定义 className', () => {
      const { container } = render(
        <Avatar className='custom-class' name='测试' />
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('应该支持传入自定义 style', () => {
      const { container } = render(
        <Avatar style={{ margin: '10px' }} name='测试' />
      )
      expect(container.firstChild).toHaveStyle({ margin: '10px' })
    })
  })

  describe('头像尺寸 (size)', () => {
    it('默认尺寸应该有正确的大小', () => {
      const { container } = render(<Avatar size='default' name='测试' />)
      expect(container.firstChild).toHaveClass('size-8')
    })

    it('sm 尺寸应该有正确的大小', () => {
      const { container } = render(<Avatar size='sm' name='测试' />)
      expect(container.firstChild).toHaveClass('size-6')
    })

    it('lg 尺寸应该有正确的大小', () => {
      const { container } = render(<Avatar size='lg' name='测试' />)
      expect(container.firstChild).toHaveClass('size-10')
    })
  })

  describe('圆角 (rounded)', () => {
    it('默认应该是圆形', () => {
      const { container } = render(<Avatar name='测试' />)
      expect(container.firstChild).toHaveClass('rounded-full')
    })

    it('rounded=false 时不应该有 rounded-full', () => {
      const { container } = render(<Avatar rounded={false} name='测试' />)
      expect(container.firstChild).not.toHaveClass('rounded-full')
    })
  })

  describe('图片显示 (src)', () => {
    it('有 src 时应该渲染 img 标签', () => {
      render(<Avatar src='https://example.com/avatar.png' name='测试' />)
      const img = screen.getByRole('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.png')
    })

    it('img 应该有正确的 alt 属性', () => {
      render(<Avatar src='https://example.com/avatar.png' name='测试用户' />)
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('alt', '测试用户')
    })
  })

  describe('名称缩写显示', () => {
    it('没有 src 时应该显示名称缩写', () => {
      render(<Avatar name='测试用户' />)
      expect(screen.getByText('测试')).toBeInTheDocument()
    })

    it('单个词应该取前两个字符', () => {
      render(<Avatar name='Hello' />)
      expect(screen.getByText('HE')).toBeInTheDocument()
    })

    it('多个词应该取首字母组合', () => {
      render(<Avatar name='John Doe' />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('没有 name 时应该渲染空', () => {
      const { container } = render(<Avatar />)
      const textContent = container.querySelector('.bg-secondary')?.textContent
      expect(textContent).toBe('')
    })
  })

  describe('组合场景', () => {
    it('大尺寸圆形头像应该正确渲染', () => {
      const { container } = render(<Avatar size='lg' rounded name='测试' />)
      expect(container.firstChild).toHaveClass('size-10')
      expect(container.firstChild).toHaveClass('rounded-full')
    })

    it('带图片的小尺寸头像应该正确渲染', () => {
      const { container } = render(
        <Avatar size='sm' src='https://example.com/avatar.png' name='测试' />
      )
      expect(container.firstChild).toHaveClass('size-6')
      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })
})
