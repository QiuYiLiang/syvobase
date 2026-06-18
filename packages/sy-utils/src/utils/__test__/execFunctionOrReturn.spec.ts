import { describe, it, expect } from 'vitest'
import { execFunctionOrReturn } from '../execFunctionOrReturn'

describe('execFunctionOrReturn 函数测试', () => {
  // 测试非函数值的情况
  it('当传入非函数值时应直接返回该值', async () => {
    const result = await execFunctionOrReturn(42)
    expect(result).toBe(42)

    const strResult = await execFunctionOrReturn('test')
    expect(strResult).toBe('test')
  })

  // 测试同步函数的情况
  it('当传入同步函数时应执行并返回结果', async () => {
    const syncFn = (x: number) => x * 2
    const result = await execFunctionOrReturn(syncFn, 21)
    expect(result).toBe(42)
  })

  // 测试异步函数的情况
  it('当传入异步函数时应等待执行完成并返回结果', async () => {
    const asyncFn = async (x: number) => {
      return new Promise((resolve) => setTimeout(() => resolve(x * 2), 10))
    }
    const result = await execFunctionOrReturn(asyncFn, 21)
    expect(result).toBe(42)
  })

  // 测试参数传递
  it('应正确传递多个参数给函数', async () => {
    const fn = (a: number, b: string) => `${a}-${b}`
    const result = await execFunctionOrReturn(fn, 42, 'test')
    expect(result).toBe('42-test')
  })
})
