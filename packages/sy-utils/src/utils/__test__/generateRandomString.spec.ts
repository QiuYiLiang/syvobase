import { describe, it, expect } from 'vitest'
import { generateRandomString } from '../generateRandomString'

describe('generateRandomString 随机字符串生成函数', () => {
  it('默认生成长度为4的字符串', () => {
    const result = generateRandomString()
    expect(result.length).toBe(4)
  })

  it('应该生成指定长度的字符串', () => {
    expect(generateRandomString(1).length).toBe(1)
    expect(generateRandomString(8).length).toBe(8)
    expect(generateRandomString(16).length).toBe(16)
    expect(generateRandomString(100).length).toBe(100)
  })

  it('生成长度为0时应返回空字符串', () => {
    const result = generateRandomString(0)
    expect(result).toBe('')
  })

  it('生成的字符串应只包含字母和数字', () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const result = generateRandomString(1000)
    for (const char of result) {
      expect(chars).toContain(char)
    }
  })

  it('多次调用应该生成不同的字符串（大概率）', () => {
    const results = new Set<string>()
    for (let i = 0; i < 100; i++) {
      results.add(generateRandomString(10))
    }
    // 100次生成10位随机字符串，应该几乎全部不同
    expect(results.size).toBeGreaterThan(95)
  })

  it('应该能生成较长的随机字符串', () => {
    const result = generateRandomString(10000)
    expect(result.length).toBe(10000)
  })

  it('生成的字符串应该包含大写字母、小写字母和数字', () => {
    // 生成足够长的字符串来确保包含所有类型字符
    const result = generateRandomString(1000)
    expect(result).toMatch(/[A-Z]/)
    expect(result).toMatch(/[a-z]/)
    expect(result).toMatch(/[0-9]/)
  })
})
