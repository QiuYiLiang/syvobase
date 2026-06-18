import { describe, it, expect } from 'vitest'
import { strToArray } from '../strToArray'

describe('strToArray 字符串转数组函数', () => {
  it('应该将逗号分隔的字符串转为数组', () => {
    expect(strToArray('a,b,c')).toEqual(['a', 'b', 'c'])
  })

  it('空字符串应返回空数组', () => {
    expect(strToArray('')).toEqual([])
  })

  it('null 应返回空数组', () => {
    expect(strToArray(null)).toEqual([])
  })

  it('undefined 应返回空数组（默认值）', () => {
    expect(strToArray()).toEqual([])
    expect(strToArray(undefined)).toEqual([])
  })

  it('应该支持自定义分隔符', () => {
    expect(strToArray('a|b|c', '|')).toEqual(['a', 'b', 'c'])
    expect(strToArray('a;b;c', ';')).toEqual(['a', 'b', 'c'])
    expect(strToArray('a-b-c', '-')).toEqual(['a', 'b', 'c'])
  })

  it('应该支持多字符分隔符', () => {
    expect(strToArray('a::b::c', '::')).toEqual(['a', 'b', 'c'])
    expect(strToArray('a<>b<>c', '<>')).toEqual(['a', 'b', 'c'])
  })

  it('单个元素应返回包含一个元素的数组', () => {
    expect(strToArray('hello')).toEqual(['hello'])
  })

  it('应该保留空元素', () => {
    expect(strToArray('a,,b')).toEqual(['a', '', 'b'])
    expect(strToArray(',a,b,')).toEqual(['', 'a', 'b', ''])
  })

  it('应该保留空格', () => {
    expect(strToArray('a, b, c')).toEqual(['a', ' b', ' c'])
  })

  it('应该处理数字字符串', () => {
    expect(strToArray('1,2,3')).toEqual(['1', '2', '3'])
  })

  it('应该处理特殊字符', () => {
    expect(strToArray('!,@,#')).toEqual(['!', '@', '#'])
  })

  it('应该处理中文', () => {
    expect(strToArray('你好,世界')).toEqual(['你好', '世界'])
  })

  it('应该处理包含分隔符的元素（使用不同分隔符）', () => {
    expect(strToArray('a,b|c,d', '|')).toEqual(['a,b', 'c,d'])
  })

  it('应该处理空格作为分隔符', () => {
    expect(strToArray('a b c', ' ')).toEqual(['a', 'b', 'c'])
  })

  it('应该处理换行符作为分隔符', () => {
    expect(strToArray('a\nb\nc', '\n')).toEqual(['a', 'b', 'c'])
  })

  it('应该处理制表符作为分隔符', () => {
    expect(strToArray('a\tb\tc', '\t')).toEqual(['a', 'b', 'c'])
  })

  it('应该处理只有分隔符的字符串', () => {
    expect(strToArray(',,,', ',')).toEqual(['', '', '', ''])
  })

  it('应该处理长字符串', () => {
    const longStr = Array(1000).fill('item').join(',')
    const result = strToArray(longStr)
    expect(result.length).toBe(1000)
    expect(result[0]).toBe('item')
    expect(result[999]).toBe('item')
  })
})
