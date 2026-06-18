import { describe, it, expect } from 'vitest'
import { cn } from '../cn'

describe('cn 类名合并函数', () => {
  describe('基础功能', () => {
    it('应该返回空字符串当没有参数时', () => {
      expect(cn()).toBe('')
    })

    it('应该返回单个类名', () => {
      expect(cn('foo')).toBe('foo')
    })

    it('应该合并多个类名', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('应该过滤 undefined 和 null 值', () => {
      expect(cn('foo', undefined, 'bar', null)).toBe('foo bar')
    })

    it('应该过滤 false 和空字符串', () => {
      expect(cn('foo', false, 'bar', '')).toBe('foo bar')
    })
  })

  describe('条件类名', () => {
    it('应该支持条件表达式', () => {
      const isActive = true
      const isDisabled = false
      expect(cn('btn', isActive && 'active', isDisabled && 'disabled')).toBe(
        'btn active'
      )
    })

    it('应该支持对象语法', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
    })

    it('应该支持混合语法', () => {
      expect(cn('base', { active: true, hidden: false }, 'extra')).toBe(
        'base active extra'
      )
    })
  })

  describe('数组支持', () => {
    it('应该支持数组参数', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })

    it('应该支持嵌套数组', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz')
    })

    it('应该支持数组与条件混合', () => {
      const hidden = false
      expect(cn(['foo', hidden && 'hidden'], 'bar')).toBe('foo bar')
    })
  })

  describe('Tailwind 合并功能', () => {
    it('应该合并冲突的 Tailwind 类名', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2')
    })

    it('应该合并 padding 类名', () => {
      expect(cn('px-4 py-2', 'px-2')).toBe('py-2 px-2')
    })

    it('应该合并 margin 类名', () => {
      expect(cn('m-4', 'mx-2')).toBe('m-4 mx-2')
    })

    it('应该合并背景色类名', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })

    it('应该合并文字颜色类名', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('应该合并字体大小类名', () => {
      expect(cn('text-sm', 'text-lg')).toBe('text-lg')
    })

    it('应该保留不同类型的类名', () => {
      expect(cn('p-4', 'm-2', 'text-red-500')).toBe('p-4 m-2 text-red-500')
    })

    it('应该正确处理 flex 相关类名', () => {
      expect(cn('flex', 'flex-col', 'flex-row')).toBe('flex flex-row')
    })

    it('应该正确处理 width/height 类名', () => {
      expect(cn('w-4', 'w-8')).toBe('w-8')
      expect(cn('h-4', 'h-full')).toBe('h-full')
    })

    it('应该合并边框类名', () => {
      expect(cn('border-2', 'border-4')).toBe('border-4')
    })

    it('应该合并圆角类名', () => {
      expect(cn('rounded-md', 'rounded-lg')).toBe('rounded-lg')
    })
  })

  describe('复杂场景', () => {
    it('应该处理复杂的组件类名场景', () => {
      const baseClasses = 'px-4 py-2 rounded-md'
      const variantClasses = 'bg-blue-500 text-white'
      const sizeClasses = 'text-sm'
      const overrideClasses = 'px-6'

      expect(
        cn(baseClasses, variantClasses, sizeClasses, overrideClasses)
      ).toBe('py-2 rounded-md bg-blue-500 text-white text-sm px-6')
    })

    it('应该处理带有条件的复杂场景', () => {
      const isLarge = true
      const isPrimary = false
      const isDisabled = true

      expect(
        cn(
          'btn',
          isLarge && 'text-lg',
          isPrimary ? 'bg-blue-500' : 'bg-gray-500',
          { 'opacity-50 cursor-not-allowed': isDisabled }
        )
      ).toBe('btn text-lg bg-gray-500 opacity-50 cursor-not-allowed')
    })

    it('应该处理响应式类名', () => {
      expect(cn('p-2', 'md:p-4', 'lg:p-6')).toBe('p-2 md:p-4 lg:p-6')
    })

    it('应该处理状态类名', () => {
      expect(cn('bg-white', 'hover:bg-gray-100', 'focus:ring-2')).toBe(
        'bg-white hover:bg-gray-100 focus:ring-2'
      )
    })

    it('应该合并相同响应式前缀的类名', () => {
      expect(cn('md:p-2', 'md:p-4')).toBe('md:p-4')
    })
  })

  describe('边界情况', () => {
    it('应该处理空数组', () => {
      expect(cn([])).toBe('')
    })

    it('应该处理空对象', () => {
      expect(cn({})).toBe('')
    })

    it('应该处理数字 0', () => {
      expect(cn('foo', 0, 'bar')).toBe('foo bar')
    })

    it('应该处理多个空格的类名', () => {
      expect(cn('  foo  ', '  bar  ')).toBe('foo bar')
    })

    it('应该处理重复的类名', () => {
      expect(cn('flex', 'flex', 'bar')).toBe('flex bar')
    })
  })
})
