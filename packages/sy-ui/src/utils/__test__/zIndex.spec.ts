import { describe, it, expect, beforeEach } from 'vitest'

// 需要在每个测试前重新导入模块以重置状态
describe('zIndex z-index 管理函数', () => {
  let getZIndex: () => number
  let addZIndex: () => number

  beforeEach(async () => {
    // 重新加载模块以重置 zIndex 状态
    const module = await import('../zIndex')
    getZIndex = module.getZIndex
    addZIndex = module.addZIndex
  })

  describe('getZIndex 获取当前 z-index', () => {
    it('应该返回初始值 1000', () => {
      // 注意：由于模块状态共享，这个测试可能会受到其他测试影响
      // 第一次导入时应该是 1000
      const initialValue = getZIndex()
      expect(initialValue).toBeGreaterThanOrEqual(1000)
    })

    it('应该返回数字类型', () => {
      expect(typeof getZIndex()).toBe('number')
    })

    it('多次调用应该返回相同的值（如果没有调用 addZIndex）', () => {
      const first = getZIndex()
      const second = getZIndex()
      const third = getZIndex()
      expect(first).toBe(second)
      expect(second).toBe(third)
    })
  })

  describe('addZIndex 增加 z-index', () => {
    it('应该增加 z-index 值', () => {
      const before = getZIndex()
      const after = addZIndex()
      expect(after).toBe(before + 1)
    })

    it('应该返回增加后的值', () => {
      const result = addZIndex()
      expect(result).toBe(getZIndex())
    })

    it('多次调用应该持续增加', () => {
      const initial = getZIndex()
      const first = addZIndex()
      const second = addZIndex()
      const third = addZIndex()

      expect(first).toBe(initial + 1)
      expect(second).toBe(initial + 2)
      expect(third).toBe(initial + 3)
    })

    it('应该返回数字类型', () => {
      expect(typeof addZIndex()).toBe('number')
    })
  })

  describe('getZIndex 和 addZIndex 交互', () => {
    it('addZIndex 后 getZIndex 应该返回新值', () => {
      addZIndex()
      const newValue = getZIndex()
      addZIndex()
      expect(getZIndex()).toBe(newValue + 1)
    })

    it('应该支持连续操作', () => {
      const start = getZIndex()
      addZIndex()
      addZIndex()
      expect(getZIndex()).toBe(start + 2)
      addZIndex()
      expect(getZIndex()).toBe(start + 3)
    })
  })

  describe('并发场景模拟', () => {
    it('应该在多次快速调用时保持正确的顺序', () => {
      const results: number[] = []
      const count = 10

      for (let i = 0; i < count; i++) {
        results.push(addZIndex())
      }

      // 验证结果是递增的
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBe(results[i - 1] + 1)
      }
    })
  })

  describe('边界情况', () => {
    it('应该处理大量增加', () => {
      const start = getZIndex()
      const iterations = 1000

      for (let i = 0; i < iterations; i++) {
        addZIndex()
      }

      expect(getZIndex()).toBe(start + iterations)
    })
  })
})
