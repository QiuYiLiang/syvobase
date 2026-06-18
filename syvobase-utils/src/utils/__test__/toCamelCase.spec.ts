import { describe, it, expect } from 'vitest'
import { toCamelCase } from '../toCamelCase'

describe('toCamelCase 驼峰命名转换函数', () => {
  describe('基本转换', () => {
    it('应该将空格分隔的单词转为驼峰', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld')
    })

    it('应该将连字符分隔的单词转为驼峰', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld')
    })

    it('应该将下划线分隔的单词转为驼峰', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld')
    })

    it('应该处理单个单词', () => {
      expect(toCamelCase('hello')).toBe('hello')
    })

    it('应该处理空字符串', () => {
      expect(toCamelCase('')).toBe('')
    })
  })

  describe('大小写处理', () => {
    it('应该将大写字母转为小写', () => {
      expect(toCamelCase('HELLO WORLD')).toBe('helloWorld')
    })

    it('应该处理混合大小写', () => {
      expect(toCamelCase('Hello World')).toBe('helloWorld')
    })

    it('应该处理全大写单词', () => {
      expect(toCamelCase('HELLO')).toBe('hello')
    })
  })

  describe('特殊字符处理', () => {
    it('应该移除特殊字符', () => {
      expect(toCamelCase('hello@world')).toBe('helloWorld')
      expect(toCamelCase('hello#world')).toBe('helloWorld')
      expect(toCamelCase('hello$world')).toBe('helloWorld')
    })

    it('应该处理多个连续特殊字符', () => {
      expect(toCamelCase('hello@@##world')).toBe('helloWorld')
    })

    it('应该移除开头和结尾的特殊字符', () => {
      expect(toCamelCase('@hello@')).toBe('hello')
      expect(toCamelCase('###hello###')).toBe('hello')
    })

    it('应该处理括号和其他符号', () => {
      expect(toCamelCase('hello(world)')).toBe('helloWorld')
      expect(toCamelCase('hello[world]')).toBe('helloWorld')
    })
  })

  describe('空白处理', () => {
    it('应该移除多余空格', () => {
      expect(toCamelCase('hello   world')).toBe('helloWorld')
    })

    it('应该移除首尾空格', () => {
      expect(toCamelCase('  hello world  ')).toBe('helloWorld')
    })

    it('应该处理制表符', () => {
      expect(toCamelCase('hello\tworld')).toBe('helloWorld')
    })

    it('应该处理换行符', () => {
      expect(toCamelCase('hello\nworld')).toBe('helloWorld')
    })
  })

  describe('数字处理', () => {
    it('应该保留数字', () => {
      expect(toCamelCase('hello 2 world')).toBe('hello2World')
    })

    it('应该处理以数字开头的字符串', () => {
      expect(toCamelCase('123 hello')).toBe('123Hello')
    })

    it('应该处理数字和字母混合', () => {
      expect(toCamelCase('hello2world')).toBe('hello2world')
    })
  })

  describe('多个分隔符组合', () => {
    it('应该处理混合分隔符', () => {
      expect(toCamelCase('hello-world_foo bar')).toBe('helloWorldFooBar')
    })

    it('应该处理连续的不同分隔符', () => {
      expect(toCamelCase('hello--__world')).toBe('helloWorld')
    })
  })

  describe('边界情况', () => {
    it('应该处理只有空格的字符串', () => {
      expect(toCamelCase('   ')).toBe('')
    })

    it('应该处理只有分隔符的字符串', () => {
      expect(toCamelCase('---___')).toBe('')
    })

    it('应该处理只有特殊字符的字符串', () => {
      expect(toCamelCase('@#$%')).toBe('')
    })

    it('应该处理长字符串', () => {
      const result = toCamelCase('the quick brown fox jumps over the lazy dog')
      expect(result).toBe('theQuickBrownFoxJumpsOverTheLazyDog')
    })

    it('应该处理单字符', () => {
      expect(toCamelCase('a')).toBe('a')
      expect(toCamelCase('A')).toBe('a')
    })
  })
})
