import { describe, it, expect } from 'vitest'
import { removePrefix } from '../removePrefix'

describe('removePrefix 移除前缀函数', () => {
  it('应该移除匹配的前缀', () => {
    expect(removePrefix('hello-world', 'hello-')).toBe('world')
  })

  it('字符串不以前缀开头时应返回原字符串', () => {
    expect(removePrefix('hello-world', 'world')).toBe('hello-world')
  })

  it('应该处理空前缀', () => {
    expect(removePrefix('hello', '')).toBe('hello')
  })

  it('应该处理空字符串', () => {
    expect(removePrefix('', 'prefix')).toBe('')
  })

  it('应该处理两个空字符串', () => {
    expect(removePrefix('', '')).toBe('')
  })

  it('前缀等于整个字符串时应返回空字符串', () => {
    expect(removePrefix('hello', 'hello')).toBe('')
  })

  it('前缀长于字符串时应返回原字符串', () => {
    expect(removePrefix('hi', 'hello')).toBe('hi')
  })

  it('应该区分大小写', () => {
    expect(removePrefix('Hello-World', 'hello')).toBe('Hello-World')
    expect(removePrefix('Hello-World', 'Hello-')).toBe('World')
  })

  it('应该处理特殊字符前缀', () => {
    expect(removePrefix('$price', '$')).toBe('price')
    expect(removePrefix('@user', '@')).toBe('user')
    expect(removePrefix('#tag', '#')).toBe('tag')
  })

  it('应该处理中文前缀', () => {
    expect(removePrefix('你好世界', '你好')).toBe('世界')
  })

  it('应该处理数字前缀', () => {
    expect(removePrefix('123abc', '123')).toBe('abc')
  })

  it('应该只移除开头的前缀', () => {
    expect(removePrefix('abcabc', 'abc')).toBe('abc')
  })

  it('应该处理带空格的前缀', () => {
    expect(removePrefix('  hello', '  ')).toBe('hello')
  })

  it('应该处理多字节字符', () => {
    expect(removePrefix('🎉🎊party', '🎉🎊')).toBe('party')
  })

  it('应该处理URL前缀', () => {
    expect(removePrefix('https://example.com', 'https://')).toBe('example.com')
    expect(removePrefix('http://example.com', 'http://')).toBe('example.com')
  })

  it('应该处理文件路径前缀', () => {
    expect(removePrefix('/home/user/file.txt', '/home/user/')).toBe('file.txt')
    expect(removePrefix('./src/index.ts', './')).toBe('src/index.ts')
  })
})
